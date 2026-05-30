#!/bin/sh
# Posts Lark deploy-status card from GitHub Actions.
# Usage: notify-lark.sh <started|success|failed>
#
# Required env vars:
#   LARK_DEPLOY_WEBHOOK_URL    — Lark bot webhook URL
#   LARK_DEPLOY_WEBHOOK_SECRET — signing secret (HMAC-SHA256)
#   JOB_NAME                   — human-readable job name
#   COMMIT_SHORT_SHA           — 8-char commit SHA
#   COMMIT_AUTHOR              — GitHub actor
#   JOB_URL                    — link to the Actions run
#   JOB_STARTED_AT             — ISO 8601 timestamp of job start

set -eu
(set -o pipefail) 2>/dev/null && set -o pipefail

# Three date flavours: GNU, BusyBox, BSD.
iso_to_epoch() {
  date -u -d "$1" +%s 2>/dev/null && return
  date -u -D "%Y-%m-%dT%H:%M:%SZ" -d "$1" +%s 2>/dev/null && return
  date -u -j -f "%Y-%m-%dT%H:%M:%SZ" "$1" +%s
}

# Shift +8h then print as UTC — no tzdata needed.
fmt_utc8() {
  shifted=$(( $1 + 28800 ))
  date -u -d "@$shifted" +"%Y-%m-%d %H:%M UTC+8" 2>/dev/null \
    || date -u -r "$shifted" +"%Y-%m-%d %H:%M UTC+8"
}

fmt_duration() {
  s=$1
  if   [ "$s" -lt 60 ];   then echo "${s}s"
  elif [ "$s" -lt 3600 ]; then echo "$((s/60))m $((s%60))s"
  else                         echo "$((s/3600))h $((s/60%60))m"
  fi
}

md_column() {
  jq -n --arg c "$1" '
    {tag:"column", width:"weighted", weight:1, vertical_align:"top",
     elements:[{tag:"markdown", content:$c}]}'
}

time_row_for() {
  mode=$1; start_epoch=$2
  started_col=$(md_column "**🕐  Started**
$(fmt_utc8 "$start_epoch")")
  if [ "$mode" = "started" ]; then
    jq -n --argjson s "$started_col" \
      '{tag:"column_set", horizontal_spacing:"default", columns:[$s]}'
    return
  fi
  duration_col=$(md_column "**⏱  Duration**
$(fmt_duration $(( $(date -u +%s) - start_epoch )))")
  jq -n --argjson s "$started_col" --argjson d "$duration_col" \
    '{tag:"column_set", horizontal_spacing:"default", columns:[$s, $d]}'
}

build_card() {
  mode=$1; start_epoch=$2
  case "$mode" in
    started) emoji="🌱"; title="Deploy started";   color="blue"  ;;
    success) emoji="🌳"; title="Deploy succeeded"; color="green" ;;
    failed)  emoji="🍖"; title="Deploy failed";    color="red"   ;;
    *) echo "unknown mode: $mode" >&2; exit 1 ;;
  esac
  job_col=$(md_column "**💼  Job**
${JOB_NAME}")
  commit_col=$(md_column "**🔖  Commit**
\`${COMMIT_SHORT_SHA}\`")
  time_row=$(time_row_for "$mode" "$start_epoch")
  jq -n \
    --arg     title      "$emoji  $title" \
    --arg     color      "$color" \
    --arg     author     "$COMMIT_AUTHOR" \
    --arg     url        "$JOB_URL" \
    --argjson job_col    "$job_col" \
    --argjson commit_col "$commit_col" \
    --argjson time_row   "$time_row" \
    '{msg_type:"interactive", card:{
       schema:"2.0",
       header:{title:{tag:"plain_text", content:$title}, template:$color},
       body:{elements:[
         {tag:"column_set", horizontal_spacing:"default",
          columns:[$job_col, $commit_col]},
         {tag:"markdown", content:("**👤  Author**\n"+$author)},
         {tag:"hr"},
         $time_row,
         {tag:"hr"},
         {tag:"button",
          text:{tag:"plain_text", content:"View pipeline"},
          type:"primary",
          behaviors:[{type:"open_url", default_url:$url}]}
       ]}
     }}'
}

# HMAC-SHA256(key="<ts>\n<secret>", msg="") → base64.
sign_payload() {
  payload=$1
  ts=$(date +%s)
  key=$(printf '%s\n%s' "$ts" "$LARK_DEPLOY_WEBHOOK_SECRET")
  sign=$(printf '' | openssl dgst -sha256 -hmac "$key" -binary | base64)
  printf '%s' "$payload" | jq --arg ts "$ts" --arg sign "$sign" \
    '. + {timestamp:$ts, sign:$sign}'
}

post() {
  curl -sS --max-time 10 -X POST "$LARK_DEPLOY_WEBHOOK_URL" \
    -H 'Content-Type: application/json' \
    -d "$1"
  echo
}

MODE="${1:?Usage: notify-lark.sh <started|success|failed>}"

: "${LARK_DEPLOY_WEBHOOK_URL:?LARK_DEPLOY_WEBHOOK_URL is not set}"
: "${LARK_DEPLOY_WEBHOOK_SECRET:?LARK_DEPLOY_WEBHOOK_SECRET is not set}"
: "${JOB_NAME:?JOB_NAME is not set}"
: "${COMMIT_SHORT_SHA:?COMMIT_SHORT_SHA is not set}"
: "${COMMIT_AUTHOR:?COMMIT_AUTHOR is not set}"
: "${JOB_URL:?JOB_URL is not set}"

START_AT="${JOB_STARTED_AT:-$(date -u +%Y-%m-%dT%H:%M:%SZ)}"
start_epoch=$(iso_to_epoch "$START_AT")
payload=$(build_card "$MODE" "$start_epoch")
payload=$(sign_payload "$payload")
post "$payload"
