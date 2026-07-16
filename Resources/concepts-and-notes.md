# Concepts & Notes — Web Dev Practice

This file logs the concepts, bugs, and "aha" moments from each day — the actual lessons behind the code. Updated after each completed day.

---

## Day 1 — Profile Card

- **Image paths:** a path starting with `/` (e.g. `/images/pic.jpg`) means "root of the file system," not your project folder. Use a relative path with no leading slash (`images/pic.jpg`) to reference files inside your own project.
- **Semantic HTML:** `<article>` is appropriate for self-contained content like a profile/bio card, instead of a generic `<div>`.
- **CSS class naming:** class names are conventionally lowercase-with-hyphens (`kebab-case`), e.g. `profile-card`, not `Profile-Card`.
- **Case sensitivity:** CSS class selectors are case-sensitive. `.profile-card` and `.Profile-Card` are two different, unrelated selectors. A mismatch here silently applies zero styles — no error is thrown.
- **Flexbox centering:** `display: flex` + `justify-content: center` + `align-items: center` on a parent centers its children both horizontally and vertically. Needs `min-height` (e.g. `100vh`) on the parent to have room to center within.
- **Circular images:** `border-radius: 50%` + fixed `width`/`height` + `object-fit: cover` (prevents distortion if the image isn't square).

---

## Day 2 — Pricing Card

- **`display: flexbox` is invalid** — the correct value is `display: flex`. There is no `flexbox` keyword in CSS.
- **`minmax()` only works inside CSS Grid** (`grid-template-columns`, etc.) — it's invalid as a plain `width` value. In flexbox, use `min-width` + `max-width` instead, combined with `flex: 1`.
- **`translate` as a standalone property** takes raw offset values (`translate: 2px -4px`), not function syntax like `translateY()` — that function syntax only works inside the `transform` property (`transform: translateY(-4px)`). Usually simplest to just combine everything into one `transform` declaration.
- **Flex properties only affect *direct* children**, not grandchildren. If a `<button>` is nested two levels deep (e.g. inside a `.card-content` wrapper), applying `display: flex` to the outer card won't let `margin-top: auto` on the button push it to the bottom — the immediate parent (`.card-content`) also needs to be a flex container.
- **Default `<ul>` styling:** browsers apply default `padding-left` (~40px) and `margin` to lists, independent of `list-style`. Removing bullets (`list-style: none`) does NOT remove that reserved padding — always pair `list-style: none` with explicit `padding: 0; margin: 0;` when building custom lists (nav menus, feature lists, etc).
- **`text-align` vs flex alignment:** `text-align: center` only works on block/inline content. Once a container becomes `display: flex`, its children are flex items, and positioning is controlled by `justify-content`/`align-items` instead — `text-align` stops having effect on those children.
- **CSS Specificity:** when two rules target the same element with conflicting properties, the browser doesn't use source order (last rule wins) — it uses a specificity score based on how many classes/IDs/elements are in the selector. E.g. `.main-nav-link li a` (1 class + 2 elements) beats `.default a` (1 class + 1 element), regardless of which is written later in the file. Fix by making the intended rule's selector at least as specific, e.g. `.main-nav-link li.default a`.
- **Debugging habit:** any time a style "isn't applying" but looks correct, check in this order: (1) exact class name spelling match between HTML and CSS (case-sensitive), (2) whether the value itself is valid CSS, (3) specificity conflicts with another rule.

---

## Day 3 — Navbar

- **`<h1>` usage:** reserved for the main heading of a page's actual content — not ideal for a recurring site logo/brand name across every page. A `<span>` or `<a>` is more appropriate for a nav logo.
- Reinforced: flexbox row layout (`justify-content: space-between`) for classic "logo left, links right" navbar pattern.
- Reinforced: CSS specificity — same lesson as Day 2, applied again to fix an "active link" style being overridden by a more specific existing rule.
- **`box-shadow` blur value:** a `box-shadow` with `0` blur radius renders as a hard-edged line rather than a soft shadow. Useful to know when deciding between a hard border-like shadow vs. a soft, diffused one.

---

## Day 4 — Button Collection

- **Base + modifier class pattern:** a shared class (`.btn`) holds common styles (padding, border-radius, cursor, transition), and modifier classes (`.btn-primary`, `.btn-outline`, etc.) add only what's different. Avoids repeating shared styles across every variant.
- **Real `disabled` attribute vs. a "disabled-looking" class:** using the actual HTML `disabled` attribute makes a button genuinely non-interactive (unclickable, unfocusable) and unlocks the `:disabled` CSS pseudo-class. A class name alone (`.btn-disabled`) only changes appearance, not behavior.
- **`:hover` still fires on disabled elements by default** — browsers don't automatically suppress hover styling just because an element is disabled. Needs an explicit override.
- **Two ways to stop hover effects on disabled elements**, with a real tradeoff:
  - `pointer-events: none` — completely ignores all mouse interaction (hover *and* click), but as a side effect, it also blocks custom `cursor` styling (e.g. `cursor: not-allowed` won't render, since the browser stops tracking pointer state entirely).
  - An explicit override rule, e.g. `.btn:disabled:hover { transform: none; }` — more verbose (needs updating if new hover effects are added later), but preserves `cursor: not-allowed`.
  - Lesson: the "cleaner"/shorter fix isn't always the right one — check what side effects it introduces against your actual requirements.
- **Verifying a fix actually worked vs. assuming it did:** default unstyled HTML buttons already look grayish in most browsers — so a "secondary" button that looks correctly gray might just be showing default browser styling if the CSS class never actually matched (e.g. due to a leftover typo). A good verification trick: temporarily set an obviously different, unmistakable value (like `background-color: hotpink`) to confirm the rule is really being applied, rather than assuming visual similarity means it's working.
- **Size variants:** combining a fixed `width` on a base class with size modifiers that only change `padding`/`font-size` causes the fixed width to fight the modifiers. Fix: use `width: auto` on the size variants so padding naturally determines the button's width.

---

## Day 5 — Blog Post Card

- **`overflow: hidden` + `border-radius` on the parent** is the correct way to make a full-bleed child image (like a thumbnail) respect the parent card's rounded corners — rather than rounding the image itself. The image can stay a plain rectangle; the parent's `overflow: hidden` clips it to match the card's shape.
- **`max-height` risk:** capping a card's height with `max-height` can silently clip/cut off content if it grows longer than expected (longer text, smaller screen, etc.) — `max-height` does not automatically add scrolling. Generally safer to let content-driven containers grow naturally unless a hard cap is truly required.
- **Invalid values inside shorthand properties:** a single invalid value inside a shorthand like `box-shadow` (e.g. a typo like `0.5pxx`) can invalidate the *entire* declaration, not just that one value — the browser drops the whole rule rather than trying to salvage the valid parts.
- **`position: absolute` + `position: relative` pairing:** to pin an element (like a badge) to a corner of a specific container, the *container* needs `position: relative` (establishes it as the positioning anchor), and the *element* needs `position: absolute` plus `top`/`right`/`bottom`/`left` offsets. Without `position: relative` on the intended parent, the absolutely positioned element will position itself relative to the nearest positioned ancestor further up the tree (or the whole page), often landing somewhere unexpected.
- **Absolute positioning removes an element from normal document flow** — the space it used to occupy collapses, so sibling elements shift to fill the gap. Often needs a compensating `margin` on a neighboring element to restore intended spacing.
- **Where an element lives in the HTML matters for absolute positioning:** the badge needed to be a direct child of `.blog-card` (not nested inside the padded content div) so it positions relative to the whole card/image area, not just the inner content box.

---

## Day 6 — Testimonial Card

- **`<blockquote>`** is the correct semantic tag for quoted text — should contain the actual quote text directly, not sit empty alongside a separate `<p>` duplicating the job.
- **Empty `img src`** commonly causes a broken-image icon; always use a real placeholder URL during practice rather than leaving `src=""`.
- **Pseudo-elements inherit from their parent by default** — `font-style`, `color`, etc. set on the parent will apply to `::before`/`::after` content too, unless explicitly overridden on the pseudo-element itself. (Caught a bug where a quote mark looked "slanted/broken" because it inherited `font-style: italic` from the blockquote.)
- **Unicode quote characters render differently across fonts.** A straight `"` and a curly `\201C`/`\201D` are different characters — but even the curly version can look like two small comma-strokes in sans-serif/system fonts rather than a bold traditional quote shape. Serif fonts (Georgia, Times) tend to render quote glyphs in the more "iconic" bold style. Sometimes a different `font-family` is the actual fix, not the character code.
- **The `top/left: 50%` + `transform: translate(-50%, -50%)` trick** is the standard, reliable way to perfectly center an absolutely-positioned element inside a `position: relative` parent, regardless of the element's own size — because `top/left: 50%` positions the element's corner at the center point, then the negative transform shifts it back by half of its own dimensions.
- **That centering trick is exact for shapes/boxes, but approximate for text glyphs** — font characters aren't always drawn perfectly centered within their own line-height box (ascender/descender spacing varies), so a mathematically "centered" quote mark can look visually off-center. Small manual adjustment (e.g. `-25%` instead of `-50%` on one axis) is a normal, expected fix — not a sign the math was wrong.
- **`z-index` stacking** only applies as a comparison between elements that both have a `position` value other than `static`. Higher `z-index` renders on top. Used here to put a large, faded decorative quote mark *behind* the actual readable quote text (watermark effect).

---

## Day 7 — Alert / Notification Boxes

- **Malformed HTML tags** (missing an opening `<`, a missing closing `"` on an attribute, or a stray extra `"`) can silently break page structure — browsers often try to auto-recover, but the result is unpredictable. Always double check tags are well-formed rather than relying on the browser's forgiveness.
- **Choosing where a "variant" class lives matters for what it visually affects.** Initially the color-variant classes (`.alert-success`, etc.) were on an *inner* content wrapper, meaning the background color wouldn't extend to cover a sibling close button outside that wrapper. Moving the variant classes onto the *outer* box (so background/border cover the whole visible component, including the close button) was the right structural fix.
- **The `font` CSS property is shorthand** and requires at minimum `font-size` AND `font-family` together to be valid (can also include weight/style/line-height). A single lone value like `font: 20px;` is invalid syntax and gets silently ignored by the browser — use the specific longhand property (`font-size: 20px;`) when only setting one aspect of the font.
- **`border-left` as a color accent (vs. a full border)** is a very common, more polished real-world pattern for alert/notification components — used instead of a full border around the box, and reads cleaner.
- Multiple valid ways to achieve "close button in the corner, content below/beside it": `justify-content: space-between` in a flex row (button beside content) vs. `flex-direction: column` + `align-self: flex-end` (button above content, its own row). Which one reads better can depend on expected content length — column layout handles variable-length messages more gracefully.

---

## Day 8 — Simple Footer

- **Leading `/` in image paths** works *only* if the project folder happens to be treated as the server root (e.g. VS Code Live Server serving the opened workspace folder) — but breaks in other common scenarios: deploying to GitHub Pages (site often lives in a subpath), opening the HTML file directly via `file:///`, or restructuring/nesting the project folder later. Relative paths (no leading slash) always resolve based on the HTML file's own location, making them more portable across setups — the safer default habit even when a leading slash technically works in one's current environment.
- **`align-content` vs `align-items`:** `align-content` controls spacing between multiple *lines/rows* of flex items — it only has a visible effect when `flex-wrap: wrap` causes items to stack into more than one row. For centering items vertically within a *single* row, `align-items: center` is the correct property. Easy to confuse since the names are so similar.
- **Choosing the right tag for "heading-like" text:** a copyright/legal line, even if styled boldly, isn't semantically a heading — using `<h4>` for it would incorrectly add it to the page's heading outline (relevant for accessibility/screen readers). A `<p>` or `<span>` is the correct choice for text that's just informational/decorative-emphasis, not an actual section heading — contrasted with column titles like "Company"/"Resources," which genuinely are small section headings and correctly use `<h4>`.
- Reinforced: not every design needs to follow the most common convention (e.g. dark footer backgrounds) — a deliberate, consistent stylistic choice elsewhere (light theme) is a legitimate reason to deviate, as long as it's an intentional decision rather than an oversight.

---

## Day 9 — Login Form (static)

- **`id` must be unique across the entire page**, not just "unique enough to look right." Two elements sharing an `id` breaks the `for`/`id` label connection (clicking a label focuses the *first* matching input, not necessarily the intended one) — and will later break JavaScript's `getElementById`, which only ever returns the first match. This bug can be invisible purely visually (nothing looks wrong) while still being functionally broken — a good reminder that "looks right" and "is correct" aren't always the same thing.
- **Never remove the default focus outline (`outline: none`) without providing a visible substitute** — this applies to *every* focusable element (text inputs, checkboxes, buttons), not just the ones explicitly styled first. Missing this on the checkbox (while it was handled correctly on the text inputs) was a good example of a rule needing to be applied consistently across *all* similar elements, not just the first one addressed.
- **Semantic tag choice for clickable text:** if a piece of text is meant to be clicked and navigate somewhere ("Forgot password?", "Sign up"), it should be an `<a>` tag — not a `<span>` (no inherent meaning) or `<strong>` (means "important text," not "clickable").
- **Why a checkbox + label can visually misalign:** form inputs default to `vertical-align: baseline` in inline/plain-block contexts, aligning to the text baseline of surrounding content — this makes a visually large checkbox sit low relative to its label text. A parent flex container's `align-items` only affects its *direct* children; wrapping the checkbox+label pair in their own flex container (`display: flex; align-items: center;`) is what actually fixes their *relative* alignment to each other.
- Reinforced: flex alignment properties only ever affect **direct children** of the flex container — a recurring theme from earlier days (Day 2's `margin-top: auto` bug had the same root cause).

---

## Day 10 — CSS-only Tooltip

- **The universal selector (`*`) applies styles to literally every element on the page.** Using it for broad spacing (e.g. `margin: 100px`) can create unpredictable layout issues since it affects nested/child elements too, not just top-level ones. Prefer scoping spacing rules to `body` or a specific container.
- **`position: absolute` needs explicit offset values (`top`/`bottom`/`left`/`right`) to actually move the element** — without them, it doesn't automatically float "above" or "away from" anything, it just stays roughly where it would've naturally flowed.
- **`bottom: 125%`** (percentage relative to the element's own height) is a common technique for positioning a tooltip/element fully above its trigger, regardless of the trigger's own height — more reliable than guessing a fixed pixel offset.
- **A missing fixed `width` on an absolutely positioned element with long/wrapping text** can cause unpredictable sizing and positioning behavior, especially combined with horizontal centering tricks (`left: 50%` + `transform: translateX(-50%)`). Setting an explicit `width` stabilizes this.
- **Why hover the wrapper, not the trigger, for a tooltip:** if the tooltip is revealed via `.trigger:hover`, moving the mouse from the trigger *into* the now-visible tooltip box (which sits outside the trigger's own boundaries) breaks the hover state and causes the tooltip to disappear/flicker. Wrapping both the trigger and the tooltip box in one parent, then triggering on `.wrapper:hover .tooltip-box`, keeps the hover state active continuously as the cursor moves between the two — the standard, correct pattern for this reason.
- **The CSS triangle trick:** an element with no width/height (`content: ""` on a pseudo-element, or an empty div) and a `border` applied renders as four triangles meeting at the center — because adjacent border edges naturally meet at a 45° diagonal at each corner. Setting three of the four border-color values to `transparent` and leaving only one colored isolates a single-direction triangle (e.g. `border-color: #333 transparent transparent transparent;` for a triangle pointing straight down from the top edge).
- **A tooltip near the very top of a page/viewport can visually clip** if there isn't enough space above it for the tooltip box to render — not a CSS logic error, just a spacing/viewport issue solved by adding more room above the trigger.
- Reinforced: real tooltips should generally hold short text (a phrase, not a paragraph) — long content in a small floating box becomes hard to read and behaves less predictably when combined with fixed widths/positioning.

---

## PHASE 1 COMPLETE (Days 1-10) 🎯
Key recurring concepts across Phase 1: exact class-name matching (case-sensitive), CSS specificity, flexbox affecting only direct children, semantic HTML tag choice, `for`/`id` accessibility relationships, `position: relative` + `position: absolute` pairing, and the base+modifier CSS class pattern (used in pricing cards, buttons, and alerts).

---

## Day 11 — *(upcoming, Phase 2: Layouts)*
*To be filled in when started.*
