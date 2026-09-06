import { ArrowRight, LoaderCircle, LogIn } from "lucide-react";

import { Button } from "@site/src/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@site/src/components/ui/field";
import { Input } from "@site/src/components/ui/input";
import { useState } from "react";
import { useAuth } from "./hooks";
import { Wordmark } from "@site/src/components/kakeibo/shared";

export function Login() {
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, authError } = useAuth();

  return (
    <main className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-background px-6 py-12">
      <div className="relative w-full max-w-xs">
        <div className="absolute bottom-full left-0 mb-8">
          <Wordmark />
        </div>
        {step === "email" ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setStep("password");
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="portal-email">Email</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    id="portal-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoFocus
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    size="icon"
                    aria-label="Continue to password"
                  >
                    <ArrowRight aria-hidden="true" />
                  </Button>
                </div>
              </Field>
            </FieldGroup>
          </form>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitting(true);
              void signIn(email, password)
                .catch(() => undefined)
                .finally(() => setSubmitting(false));
            }}
          >
            <FieldGroup>
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="portal-password">Password</FieldLabel>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => setStep("email")}
                  >
                    {email}
                  </button>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="portal-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoFocus
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    size="icon"
                    aria-label="Sign in"
                  >
                    {submitting ? (
                      <LoaderCircle
                        className="animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <LogIn aria-hidden="true" />
                    )}
                  </Button>
                </div>
                {authError && (
                  <p className="m-0 mt-2 text-sm text-destructive">
                    {authError}
                  </p>
                )}
              </Field>
            </FieldGroup>
          </form>
        )}
      </div>
    </main>
  );
}
