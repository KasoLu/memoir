# Data Model

## Extension Settings

Stored in:

- `extension_settings.chat_compactor`

Current shape:

```json
{
  "summaryGenerationMode": "shared-api",
  "independentApiConfig": {
    "model": "",
    "apiUrl": "",
    "apiKey": ""
  },
  "apiProfiles": [],
  "currentApiProfileId": "",
  "customPromptProfiles": [],
  "promptProfileId": "main-archive",
  "stylePatchId": "none",
  "fanficPatchEnabled": false,
  "summaryResponseLength": 0,
  "fusionResponseLength": 0,
  "summaryTokenBudgetPercent": 25,
  "summaryTokenBudgetCap": 0,
  "autoInjectApproved": true,
  "injectionPosition": 0,
  "injectionDepth": 1,
  "injectionRole": 0,
  "injectionWrapTag": "",
  "defaultRangeSize": 20,
  "summaryFilterFragments": [],
  "fusionSystemPrompt": "...",
  "fusionUserTemplate": "..."
}
```

## Chat Store

Stored in:

- `chat_metadata.extensions.chat_compactor`

Current shape:

```json
{
  "version": 1,
  "approvedRanges": [],
  "approvedBaselineRanges": [],
  "cumulativeSummary": "",
  "approvedBaselineSummary": ""
}
```

## Approved Range Shape

Each entry in `approvedRanges`:

```json
{
  "id": "range_...",
  "index": 1,
  "title": "【第1次总结】(楼 1-20)",
  "startMes": 0,
  "endMes": 19,
  "sourceHash": "sha256...",
  "changed": false,
  "approvedAt": 0
}
```

## Draft Shape (runtime only, not persisted)

Drafts are provider outputs that have not been approved yet.

```json
{
  "id": "draft_...",
  "range": {
    "startMes": 0,
    "endMes": 19,
    "startFloor": 1,
    "endFloor": 20
  },
  "sourceHash": "sha256...",
  "request": {},
  "response": {},
  "status": "draft",
  "promptProfileId": "main-archive",
  "stylePatchId": "none",
  "fanficPatchEnabled": false,
  "providerInfo": {
    "requestedMode": "shared-api",
    "resolvedMode": "shared-api",
    "fallbackUsed": false,
    "fallbackReason": "",
    "model": ""
  },
  "createdAt": 0
}
```

## Custom Prompt Profile Shape

Stored inside:

- `extension_settings.chat_compactor.customPromptProfiles`

```json
{
  "id": "custom-prompt-...",
  "label": "My Prompt",
  "systemPrompt": "...",
  "userTemplate": "..."
}
```

## Status Values

- `draft`
- `approved`
- `rejected`

## Changed Detection

Approved ranges have a `changed` boolean flag. When source messages are edited and
the hash no longer matches `sourceHash`, the flag is set to `true`. The summary
continues to be usable (soft detection, not hard disable).
