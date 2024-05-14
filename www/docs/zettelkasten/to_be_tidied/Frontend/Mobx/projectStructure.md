# Project Structure

```
.
├── README.md
├── dir_structure.txt
├── jest.config.ts
├── mock
│   ├── priapi
│   │   ├── ticket
│   │   │   ├── edit.js
│   │   │   └── list.js
│   │   └── v1
│   │       └── scs
│   │           ├── admin
│   │           │   ├── conditions
│   │           │   │   ├── field-names.js
│   │           │   │   ├── field-operators
│   │           │   │   │   └── {id}.js
│   │           │   │   └── field-values
│   │           │   │       └── {id}.js
│   │           │   ├── fields
│   │           │   │   └── list.js
│   │           │   ├── forms
│   │           │   │   └── {id}.js
│   │           │   ├── forms.js
│   │           │   ├── skills.js
│   │           │   ├── views
│   │           │   │   ├── activate
│   │           │   │   │   └── {viewId}.js
│   │           │   │   └── deactivate
│   │           │   │       └── {viewId}.js
│   │           │   ├── views.js
│   │           │   ├── workflows
│   │           │   │   └── {workflowId}.js
│   │           │   └── workflows.js
│   │           ├── agents
│   │           │   └── config.js
│   │           ├── fields
│   │           │   └── {statusPath}
│   │           │       └── {fieldId}.js
│   │           ├── form
│   │           │   ├── list.js
│   │           │   └── {id}.js
│   │           ├── groups.js
│   │           ├── menus
│   │           │   └── tree.js
│   │           ├── related
│   │           │   └── tickets.js
│   │           ├── tickets
│   │           │   ├── {ticketId}
│   │           │   │   └── transfer.js
│   │           │   └── {ticketId}.js
│   │           ├── tickets.js
│   │           └── views.js
│   └── scs
│       └── api
│           └── v1
│               ├── configs
│               │   └── options.js
│               ├── fields
│               │   ├── list.js
│               │   └── views
│               │       └── {viewId}.js
│               ├── tags
│               │   └── autocomplete.js
│               └── tickets.js
├── module-federation.config.js
├── project.json
├── proxy.config.json
├── src
│   ├── __mocks__
│   │   └── @ok
│   │       └── blade.js
│   ├── app
│   │   ├── __demo__
│   │   │   ├── app-test.test.tsx
│   │   │   ├── app-test.tsx
│   │   │   └── welcome.tsx
│   │   ├── app.module.less
│   │   ├── app.tsx
│   │   ├── components
│   │   │   ├── AvatarWithStatus
│   │   │   │   ├── index.module.less
│   │   │   │   └── index.tsx
│   │   │   ├── CoreLayout
│   │   │   │   ├── __test__
│   │   │   │   │   ├── __snapshots__
│   │   │   │   │   │   └── index.test.jsx.snap
│   │   │   │   │   └── index.test.jsx
│   │   │   │   ├── components
│   │   │   │   │   ├── Menu
│   │   │   │   │   │   ├── __test__
│   │   │   │   │   │   │   ├── __snapshots__
│   │   │   │   │   │   │   │   └── index.test.tsx.snap
│   │   │   │   │   │   │   └── index.test.tsx
│   │   │   │   │   │   ├── component
│   │   │   │   │   │   │   └── WorkspaceIcon.tsx
│   │   │   │   │   │   ├── index.module.less
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   └── NavBar
│   │   │   │   │       ├── __test__
│   │   │   │   │       │   ├── __snapshots__
│   │   │   │   │       │   │   └── index.test.jsx.snap
│   │   │   │   │       │   └── index.test.jsx
│   │   │   │   │       ├── components
│   │   │   │   │       │   ├── Agent
│   │   │   │   │       │   │   ├── index.module.less
│   │   │   │   │       │   │   └── index.tsx
│   │   │   │   │       │   ├── AgentAvatar
│   │   │   │   │       │   │   └── index.tsx
│   │   │   │   │       │   ├── AgentPanel
│   │   │   │   │       │   │   ├── index.module.less
│   │   │   │   │       │   │   └── index.tsx
│   │   │   │   │       │   ├── DutyDropdown
│   │   │   │   │       │   │   ├── index.module.less
│   │   │   │   │       │   │   ├── index.tsx
│   │   │   │   │       │   │   └── utils.ts
│   │   │   │   │       │   └── LabelWithStatus
│   │   │   │   │       │       ├── index.module.less
│   │   │   │   │       │       └── index.tsx
│   │   │   │   │       ├── hooks
│   │   │   │   │       │   ├── __test__
│   │   │   │   │       │   │   └── useStore.test.js
│   │   │   │   │       │   └── useStore.ts
│   │   │   │   │       ├── index.module.less
│   │   │   │   │       ├── index.tsx
│   │   │   │   │       ├── services
│   │   │   │   │       │   ├── index.ts
│   │   │   │   │       │   └── types.ts
│   │   │   │   │       └── stores
│   │   │   │   │           └── index.ts
│   │   │   │   ├── index.module.less
│   │   │   │   └── index.tsx
│   │   │   └── WithErrorBoundary
│   │   │       └── index.tsx
│   │   ├── constants
│   │   │   ├── enums.ts
│   │   │   ├── index.ts
│   │   │   ├── routes.ts
│   │   │   └── theme.ts
│   │   ├── hooks
│   │   │   ├── useAgent.ts
│   │   │   ├── useCopy.ts
│   │   │   ├── useForm.ts
│   │   │   ├── useListenMessage.ts
│   │   │   ├── useMenus.ts
│   │   │   ├── useRequest.ts
│   │   │   └── useWebsocket.ts
│   │   ├── locale
│   │   │   ├── en-US.ts
│   │   │   ├── index.ts
│   │   │   └── zh-CN.ts
│   │   ├── pages
│   │   │   ├── AdminCenter
│   │   │   │   ├── GroupMgt
│   │   │   │   │   ├── components
│   │   │   │   │   │   └── GroupCreation.tsx
│   │   │   │   │   ├── hooks
│   │   │   │   │   │   ├── useColumns.tsx
│   │   │   │   │   │   └── useStore.ts
│   │   │   │   │   ├── index.module.less
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── services.ts
│   │   │   │   │   ├── stores.ts
│   │   │   │   │   └── types.ts
│   │   │   │   ├── LandingPage
│   │   │   │   │   ├── index.module.less
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── RuleWorkflowEditor
│   │   │   │   │   ├── components
│   │   │   │   │   │   ├── Actions
│   │   │   │   │   │   │   ├── AddBranchIcon
│   │   │   │   │   │   │   │   ├── index.module.less
│   │   │   │   │   │   │   │   └── index.tsx
│   │   │   │   │   │   │   ├── AddNodeIcon
│   │   │   │   │   │   │   │   ├── index.module.less
│   │   │   │   │   │   │   │   └── index.tsx
│   │   │   │   │   │   │   └── AddOptionDisplay
│   │   │   │   │   │   │       ├── index.module.less
│   │   │   │   │   │   │       └── index.tsx
│   │   │   │   │   │   ├── ConfigForm.tsx
│   │   │   │   │   │   ├── Nodes
│   │   │   │   │   │   │   ├── ActionNode.tsx
│   │   │   │   │   │   │   ├── AssigneeNode.tsx
│   │   │   │   │   │   │   ├── ConditionNode.tsx
│   │   │   │   │   │   │   ├── EndNode
│   │   │   │   │   │   │   │   ├── index.module.less
│   │   │   │   │   │   │   │   └── index.tsx
│   │   │   │   │   │   │   ├── GenericNode
│   │   │   │   │   │   │   │   ├── index.module.less
│   │   │   │   │   │   │   │   └── index.tsx
│   │   │   │   │   │   │   ├── StartNode.tsx
│   │   │   │   │   │   │   └── TriggerNode.tsx
│   │   │   │   │   │   ├── WorkflowBuilder.tsx
│   │   │   │   │   │   └── index.module.less
│   │   │   │   │   ├── constants
│   │   │   │   │   │   ├── default.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── hooks
│   │   │   │   │   │   └── useNodeToggle.ts
│   │   │   │   │   ├── index.module.less
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── services
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── theme
│   │   │   │   │   │   └── theme.less
│   │   │   │   │   ├── types.ts
│   │   │   │   │   └── utils
│   │   │   │   │       └── converter.ts
│   │   │   │   ├── TicketFieldsMgt
│   │   │   │   │   ├── components
│   │   │   │   │   │   └── FieldCreation
│   │   │   │   │   │       ├── FieldOptionSelect.tsx
│   │   │   │   │   │       ├── FieldOptionSetting.tsx
│   │   │   │   │   │       ├── index.module.less
│   │   │   │   │   │       └── index.tsx
│   │   │   │   │   ├── constants
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── hooks
│   │   │   │   │   │   ├── useColumns.tsx
│   │   │   │   │   │   ├── useFieldValueTypeOptions.tsx
│   │   │   │   │   │   └── useStore.ts
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── services
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── stores.ts
│   │   │   │   │   └── types.ts
│   │   │   │   ├── TicketFormMgt
│   │   │   │   │   ├── components
│   │   │   │   │   │   └── FormCreation.tsx
│   │   │   │   │   ├── hooks
│   │   │   │   │   │   ├── __test__
│   │   │   │   │   │   │   └── useStore.test.ts
│   │   │   │   │   │   ├── useColumns.tsx
│   │   │   │   │   │   └── useStore.ts
│   │   │   │   │   ├── index.module.less
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── services
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── stores.ts
│   │   │   │   │   └── types.ts
│   │   │   │   ├── TicketSkillMgt
│   │   │   │   │   ├── hooks
│   │   │   │   │   │   └── useSkills.ts
│   │   │   │   │   ├── index.module.less
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── services.ts
│   │   │   │   │   └── utils.tsx
│   │   │   │   ├── TicketViewMgt
│   │   │   │   │   ├── components
│   │   │   │   │   │   └── ViewCreation.tsx
│   │   │   │   │   ├── hooks
│   │   │   │   │   │   ├── useColumns.tsx
│   │   │   │   │   │   ├── useStore.ts
│   │   │   │   │   │   └── useViews.tsx
│   │   │   │   │   ├── index.module.less
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── services.ts
│   │   │   │   │   ├── stores.ts
│   │   │   │   │   └── types.ts
│   │   │   │   ├── WorkflowsMgt
│   │   │   │   │   ├── hooks
│   │   │   │   │   │   ├── useColumns.tsx
│   │   │   │   │   │   └── useStore.ts
│   │   │   │   │   ├── index.module.less
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── services.ts
│   │   │   │   │   ├── stores.ts
│   │   │   │   │   └── types.ts
│   │   │   │   ├── components
│   │   │   │   │   ├── Description.tsx
│   │   │   │   │   ├── Menus
│   │   │   │   │   │   ├── index.module.less
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── MgtContent
│   │   │   │   │   │   ├── index.module.less
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── TicketFieldSortPicker
│   │   │   │   │   │   ├── index.module.less
│   │   │   │   │   │   ├── index.tsx
│   │   │   │   │   │   └── services.ts
│   │   │   │   │   └── UpdateBySelect
│   │   │   │   │       └── index.tsx
│   │   │   │   ├── constants
│   │   │   │   │   └── index.ts
│   │   │   │   ├── hooks
│   │   │   │   │   └── useForm.ts
│   │   │   │   ├── index.module.less
│   │   │   │   ├── index.tsx
│   │   │   │   ├── services.ts
│   │   │   │   └── types.ts
│   │   ├── schemas
│   │   │   ├── common
│   │   │   │   └── form.ts
│   │   │   ├── get_admin_conditions_field_names.ts
│   │   │   ├── get_admin_conditions_field_operators.ts
│   │   │   ├── get_admin_conditions_field_values.ts
│   │   │   ├── get_admin_fields.ts
│   │   │   ├── get_admin_fields_fixed.ts
│   │   │   ├── get_admin_forms.ts
│   │   │   ├── get_admin_groups.ts
│   │   │   ├── get_admin_skills.ts
│   │   ├── services
│   │   │   └── index.ts
│   │   ├── stores
│   │   │   └── index.ts
│   │   ├── types
│   │   │   ├── api.ts
│   │   │   ├── email.ts
│   │   │   ├── enums.ts
│   │   │   ├── index.ts
│   │   │   └── models.ts
│   │   ├── unit_test
│   │   │   ├── app-test.test.tsx
│   │   │   ├── app-test.tsx
│   │   │   └── welcome.tsx
│   │   └── utils
│   │       ├── APIError.ts
│   │       ├── assignToMe.ts
│   │       ├── axios.ts
│   │       ├── findMenuKeysByPathname.ts
│   │       ├── getFieldValueTypeInfo.tsx
│   │       ├── getSimpleDutyStatus.ts
│   │       ├── index.ts
│   │       ├── locale.ts
│   │       ├── rafPoll.ts
│   │       ├── reporter
│   │       │   ├── index.tsx
│   │       │   ├── logger.ts
│   │       │   ├── noti.tsx
│   │       │   ├── report.ts
│   │       │   ├── schema.ts
│   │       │   ├── services.ts
│   │       │   └── types.ts
│   │       ├── stores.ts
│   │       ├── ticketStatusMap.ts
│   │       └── url.ts
│   ├── assets
│   │   ├── font
│   │   │   ├── HarmonyOS_Sans_Bold.woff2
│   │   │   ├── HarmonyOS_Sans_Medium.woff2
│   │   │   └── HarmonyOS_Sans_Regular.woff2
│   │   ├── img
│   │   │   ├── Group404.png
│   │   │   ├── Groupempty.png
│   │   │   ├── Groupno_perm.png
│   │   │   ├── Groupserver_internal_error.png
│   │   │   ├── drag.png
│   │   │   ├── logo.svg
│   │   │   └── tool_set.png
│   │   └── module-federation.manifest.json
│   ├── bootstrap.tsx
│   ├── config
│   │   ├── fetchConfig.ts
│   │   ├── localeConfig.ts
│   │   ├── okdBConfig.ts
│   │   └── sentryInit.ts
│   ├── environments
│   │   ├── environment.prod.ts
│   │   └── environment.ts
│   ├── index.d.ts
│   ├── index.html
│   ├── main.ts
│   ├── remotes.d.ts
│   └── styles.less
├── tsconfig.json
├── tsconfig.spec.json
└── webpack.config.js
```