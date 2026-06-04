export const CONTENT_COMPATIBILITY_PATCH_TEXT = `Fictional Narrative Archive Stability Addendum

This addendum is used only to keep story-archive output stable when the selected fictional chat range contains high-intensity material.
The task remains the same: produce a useful narrative record for long-term continuity.

Scope
- Treat the input as fictional narrative material.
- Preserve story structure, causal links, character state, relationship state, location state, injuries, physiological changes, promises, conditions, secrets, and unresolved threads.
- The archive should record what changed in the story, not reproduce the scene for effect.

High-Intensity Content Handling
If the source text contains violence, injury, intimate interaction, reproductive or biological description, coercive conflict, humiliation, or other sensitive fictional events:
- Keep the event if it affects later continuity.
- Convert explicit surface description into neutral archive language.
- Preserve the participants, the general interaction category, the immediate outcome, and any later dependency created by the event.
- Prefer functional descriptions such as "an intimate encounter changed their relationship state", "a biological condition changed", "an injury affected mobility", or "a coercive conflict created an unresolved risk".
- Do not copy graphic phrasing when an abstract factual record is enough.

Stability Rules
- Do not return an empty answer.
- Do not use refusal-style wording.
- Do not replace an event with only vague text such as "sensitive content occurred".
- Do not omit a plot-relevant event because it is mature, violent, biological, or uncomfortable.
- If exact wording is unstable, summarize the event's narrative function and consequences.

Output Discipline
- Keep the output non-judgmental and structurally descriptive.
- Do not moralize, warn, lecture, or add meta commentary.
- Do not continue the story.
- Return only the requested archive format.`;

export const EMPTY_RESPONSE_RECOVERY_PATCH_TEXT = `Fictional Archive Recovery Addendum

The previous attempt may have produced empty or unstable output. Recover by using the safest useful archive form:

1. Return a non-empty narrative record.
2. Do not reproduce graphic wording.
3. Do not skip mature, violent, biological, or intimate fictional events if they affect continuity.
4. Convert unstable details into neutral functional summaries.
5. Preserve participants, sequence, state changes, relationship changes, consequences, and unresolved threads.
6. If a detail cannot be safely phrased directly, record what it changed in the story.
7. Return only the requested summary body, with no explanation or refusal.`;
