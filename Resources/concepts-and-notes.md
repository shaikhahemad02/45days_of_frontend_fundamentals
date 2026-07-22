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

## Day 11 — Responsive Photo Gallery

- **`grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))`** — the core responsive-grid technique: fits as many columns as possible where each is at least `200px`, growing to share available space equally (`1fr`) when there's room. Columns automatically appear/disappear as the viewport resizes, with no media queries needed — something flexbox alone can't cleanly replicate.
- **`backdrop-filter: blur()`** blurs whatever is visually *behind* an element, showing through its (typically semi-transparent) background — the core mechanism behind "glassmorphism" UI style. Needs something behind it (a gradient, image, or pattern) to actually show a visible blurred effect. May need a `-webkit-backdrop-filter` prefix alongside the standard property for broader browser support (notably Safari).
- **`box-shadow` accepts multiple comma-separated shadows on one element** — e.g. one normal outer shadow plus one or more `inset` shadows (drawn *inside* the element's edge instead of outside). Combining an outer shadow (lifts the whole panel off the page) with inset highlights/shadows (simulates light catching an edge, or the appearance of physical depth/thickness) is how a flat `div` can convincingly read as a "glass slab."
- **Shadows that read as "floating above" vs. "sinking into" a surface** differ mainly in vertical offset, blur radius, and opacity — floating shadows tend to be sharper/darker with more offset; recessed/sunken shadows tend to be softer, more blurred, and lower-opacity. This is a matter of visual judgment/taste, not a fixed formula — worth experimenting with values directly rather than expecting one "correct" number.
- **A stray/invalid character inside a CSS rule block** (e.g. an accidental `*` left after a semicolon) is invalid syntax that can cause a browser's CSS parser to behave unpredictably for that rule — worth scanning for typos like this whenever a rule "isn't working right" for no obvious reason.
- **Editor warnings (e.g. VS Code's red underline) often flag browser-compatibility notices, not necessarily broken code** — hovering the warning usually reveals the exact concern (commonly: "needs a vendor prefix" or "limited browser support"), which is a different, less urgent category of issue than a syntax error.

---

## Day 12 — Landing Page Hero Section

- **`font-weight` only accepts specific values:** the keywords `normal`, `bold`, `bolder`, `lighter`, or a number from `100`-`900` (`400` = normal, `700` = bold). Made-up keywords like `medium` are invalid and silently ignored, leaving the element at its default weight.
- **`gap` only works inside a `display: flex` or `display: grid` container** — setting it on a plain block element has no effect at all. A recurring theme: several CSS properties are contextual and only function within the right kind of parent (same family of bug as flex-only alignment properties from earlier days).
- **Full-bleed background images belong in CSS (`background-image`), not `<img>` tags** — this is the standard technique for hero sections, page backgrounds, and similar full-width decorative imagery, as opposed to `<img>`, which is for meaningful, content-level images.
- **Layering a semi-transparent gradient over a background image** (`linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(...)`) — listing multiple values comma-separated in `background-image` stacks them, with the first listed rendering on top. This is the standard way to darken a photo background uniformly so light-colored overlay text stays readable, without needing a separate overlay `<div>`.
- **`100vw`/`100dvw` measures the full viewport width including the space a scrollbar would occupy**, which can cause an element to be slightly wider than the visible page and trigger unwanted horizontal scrolling if the page has other tall/overflowing content. `width: 100%` (relative to the parent's actual space) is often a safer choice for full-bleed elements.
- **Hover effects that change an element's size (padding, border-width, font-size, margin) cause neighboring content to visually shift**, because the browser must re-run layout around the now-differently-sized element — this becomes especially noticeable inside a flex container using `justify-content: center`, since the whole group's centering recalculates whenever total content height changes. **Fix pattern:** reserve the final size upfront (e.g. a `border-bottom: 3px solid transparent` by default, some fixed `padding` applied unconditionally) so `:hover` only changes *visual* properties (color, opacity, background, transform) — never the element's actual box dimensions.

---

## Day 13 — Feature Section (3-column)

- **Media queries (`@media (max-width: ...) { ... }`)** are the traditional, explicit way to handle responsiveness — styles inside only apply when the viewport matches the condition. Contrasted with Day 11's `auto-fit`/`minmax()` technique: media queries give *precise control* over exactly what happens at specific breakpoints (e.g., "always exactly 3 columns above 768px, exactly 1 below it"), whereas `auto-fit` handles column count *automatically* with no explicit breakpoints, useful when the exact number of columns at any given width doesn't need to be tightly controlled. Both are legitimate, commonly-used tools for different situations.
- **`grid-template-columns: repeat(3, 1fr)`** is a clean way to create exactly 3 equal-width columns — simpler to write than the equivalent `1fr 1fr 1fr`, and a natural fit for Grid versus flexbox when column count is fixed and known upfront (contrasted with `auto-fit`, used in Day 11, where column count is left flexible).
- **Only one `<h1>` should exist per page** — reinforced from Day 12: a hero section's headline typically claims the page's single `<h1>`, and every subsequent section heading (like a "Features" section title) should step down to `<h2>`, with individual item titles within that section going to `<h3>`. This was correctly self-applied without needing a repeated reminder — a good sign the heading-hierarchy concept has been internalized.
- **`backdrop-filter: blur()` requires a length unit (e.g. `px`), not a percentage.** An invalid value like `blur(10%)` is typically silently ignored or treated as `0` by the browser rather than throwing a visible error — another example of a CSS bug that doesn't "look broken" so much as silently under-deliver the intended effect.

---

## Day 14 — Pricing Table (responsive Grid)

- **Grid vs. flexbox is often a swap at the "row/container" level only** — internal component logic (like the flex-column + `margin-top: auto` trick for pinning a button to the bottom of a card) doesn't need to change just because the *outer* layout method changed. Recognizing which part of a layout problem the container-level choice (Grid vs flex) actually affects, versus which part is independent of it, is a useful distinction.
- **Reusing/adapting prior work is a legitimate and valuable skill**, not "cheating" — correctly identifying that most of Day 2's CSS could carry over unchanged, with only the row-container's `display`/`grid-template-columns` needing to change, demonstrated real understanding of *why* the original code worked, not just that it did.
- Reinforced (repeat pattern from Days 12/13): multiple `<h1>` elements on a single page is a semantic issue even when nothing looks visually wrong — each repeating content unit (like a plan name in a pricing table) should generally not claim the page's single main heading slot.

---

## Day 15 — Recipe Card Grid

- **A `transition` only animates the property on the element it's actually declared on.** If a hover rule transforms a *different* element than the one carrying the `transition` declaration, the transition has no effect — the change will snap instantly rather than animate, even though a `transition` exists somewhere in the CSS. Always double-check that the element being transformed in the `:hover` rule is the same element the `transition` property lives on.
- **A bug can "mostly work" for the wrong reason**, masking the actual mistake. Here, scaling the wrapper (`.recipe-img-wrapper:hover { transform: scale(...) }`) instead of the image visually looked *almost* correct because a second, unrelated `overflow: hidden` (on the parent `.recipe-card`) coincidentally clipped the overflow anyway — but the intended smooth transition still failed, and relying on a second, incidental containment layer isn't the same as the technique being correct. A good general debugging habit: even when something "looks right," check whether it's working for the *actual intended reason*, not just by lucky side effect.
- **Standard hover-zoom pattern reinforced:** hover the *container* (bigger/easier target, avoids flicker issues), but apply the `transform`/`transition` to the *image inside it* — parallels Day 10's tooltip lesson about hovering a wrapper rather than the trigger element itself, and Day 5's static `overflow: hidden` containment technique, now applied dynamically.

---

## Day 16 — FAQ Accordion (CSS-only)

- **`<details>`/`<summary>` are native, built-in HTML elements with expand/collapse behavior included in the browser** — clicking `<summary>` automatically toggles its parent `<details>` open/closed, with zero JavaScript required. A genuinely underused pair of tags worth knowing early.
- **The `[open]` attribute selector** targets an element based on the presence of a specific HTML attribute — `<details>` automatically gains `open` when expanded (and loses it when collapsed), so `.faq-item[open] { ... }` (or targeting a descendant, like `.faq-item[open] summary::after`) allows state-based styling driven entirely by the browser's own toggle behavior, no JS state-tracking needed.
- **`summary::-webkit-details-marker { display: none; }`** removes the default disclosure triangle in WebKit/Chromium browsers; `list-style: none` on `summary` handles it in others — both are typically needed together for consistent cross-browser removal of the native marker, to replace it with a custom indicator.
- **`align-items: center` on a flex column causes children to shrink to their own natural content width** rather than stretching to fill the container — this is why FAQ items with short questions (closed, no visible answer paragraph) appeared narrower than items with long answers visible (open state affecting the item's total content, and therefore its "natural" width under `center` alignment). `align-items: stretch` (the actual default value) makes all flex children fill the container's cross-axis width uniformly, which is almost always the desired behavior for a list of full-width rows like an accordion.

---

## Day 17 — Responsive Navbar with Hamburger (CSS-only)

- **The checkbox hack:** a hidden checkbox (`display: none`) paired with a `<label for="...">` lets a click toggle real, CSS-readable state (`:checked`) with zero JavaScript — the same `for`/`id` label-click mechanism from Day 9's "Remember Me" checkbox, just repurposed to drive a UI toggle rather than collect form input.
- **The general sibling combinator (`~`):** `.a:checked ~ .b` selects any `.b` element that comes *after* `.a` as a sibling under the same parent — not necessarily immediately after (that's the adjacent sibling combinator, `+`). Critically, **this only works forward in HTML source order** — CSS cannot select a *preceding* sibling based on a later element's state, so the checkbox must appear before the element it's meant to reveal/control in the HTML.
- **A single mismatched class name in a `:checked ~` selector silently disables the entire toggle mechanism** — same root-cause pattern as many earlier bugs (Day 2, Day 8, Day 17 itself), reinforcing that exact class-name matching is the first thing to verify whenever an otherwise-correct-looking interactive rule "does nothing."
- Reinforced: adapting and extending prior work (Day 3's navbar) rather than rebuilding from scratch is a legitimate, efficient approach — mirrors the same lesson from Day 14's pricing table.

---

## Day 18 — Dashboard Layout (static, sidebar + main)

- **`grid-template-areas` defines a layout as a visual text map** — each quoted string is a row, each word within it a column/cell. A name repeated across multiple rows or columns means that named area spans those cells (e.g. a sidebar spanning both the topbar row and the main-content row). Each child element then just declares `grid-area: <name>` — the browser computes actual row/column placement, no manual line-number math required. Widely considered one of the most readable ways to express page-level layouts in Grid.
- **A grid-area can itself become an independent nested grid container** — `.main-content` was simultaneously (a) a named area within the outer `.dashboard` grid, and (b) its own separate `display: grid` context for laying out widget cards inside it. Nesting grids this way is normal and common in real dashboard/app layouts.
- **The general sibling selector (`~`) requires elements to share the same direct parent** — reinforced from Day 17, but with a new failure mode: a checkbox nested one level deeper (inside `.topbar`) than the element it needed to control (`.sidebar`, a direct child of `.dashboard`) meant they were never true siblings, regardless of source order. The fix required restructuring the HTML itself (moving the checkbox up a level), not just adjusting CSS — a good example of how some bugs require rethinking element placement in the document tree, not just tweaking selectors.
- **Negative `z-index` values push an element behind its own parent's background**, not merely behind sibling content — this can cause an intended overlay/backdrop effect to render invisibly beneath the page rather than as a dimming layer on top of it. A positive `z-index` (lower than the foreground element it accompanies) is usually what's actually wanted for a backdrop.

---

## Day 19 — Card Flip Animation

- **`perspective`** (set on the *outer*, non-rotating wrapper) defines how strong a 3D depth effect looks for its 3D-transformed descendants — without it, a `rotateY`/`rotateX` transform just squashes an element flat in 2D rather than appearing to genuinely rotate through 3D space. Smaller perspective values = more dramatic/exaggerated depth; larger values = subtler, more distant-feeling rotation.
- **`transform-style: preserve-3d`** (set on the element whose *children* need real 3D positioning) is required for nested 3D transforms to actually work — without it, children collapse onto a flat 2D plane regardless of their own individual `transform` values.
- **`backface-visibility: hidden`** hides an element specifically at the moment its *rotated-away* side would be facing the viewer — this is the mechanism that prevents both the front and back faces from appearing simultaneously garbled/overlapping mid-rotation.
- **Why the back face starts pre-rotated 180°:** since front and back faces are absolutely positioned in the exact same spot, the back face must already be rotated 180° in its resting state, so that when the shared parent rotates the full 180°, the back face's *effective* rotation becomes 360° (visually identical to 0°, right-side-up and readable) while the front face's effective rotation becomes 180° (now facing away, hidden by `backface-visibility`).
- **`box-sizing: border-box` matters even more when two elements need to overlap exactly** (like two absolutely-positioned card faces) — without it, adding `padding` to one or both faces would make them slightly different total sizes than intended (padding normally adds to an element's declared width/height rather than being included within it), breaking the precise overlap needed for a clean flip.
- **Static styling (border/background/shadow) applied to a non-rotating wrapper, when its rotating children are positioned absolutely inside it, can visually "leak through" during the animation** — since the wrapper itself never rotates, only its absolutely-positioned children do. The fix is to move that styling onto the individual rotating faces themselves, so each face is a complete, self-contained visual unit.

---

## Day 20 — Full Landing Page (Phase 2 Milestone)

- **Merging independently-built components into one page surfaces issues invisible in isolation** — heading hierarchy is the clearest example: `<h1>`/`<h2>`/`<h3>` choices that were perfectly reasonable for a standalone Day 12/13/14 file become wrong the moment those files share a page, since only one true page-level `<h1>` can exist and every subsequent section must step down the hierarchy relative to what's already been claimed above it.
- **`display: grid` requires an explicit `grid-template-columns`/`-rows` to do anything** — reinforced from a direct question this session: unlike flexbox, which has a usable default (`flex-direction: row`), Grid defines zero structure on its own. Setting `display: grid` alone just puts every child into its own implicit row, stacked vertically — the browser needs to be told the actual column/row shape before any arrangement happens. This is one of the core philosophical differences between the two systems: flexbox is content-driven with sensible defaults; Grid is structure-first and requires explicit definition.
- **Malformed/misspelled tags (e.g. `<sapn>`)** aren't just invalid — the browser doesn't recognize them as any known element, so they typically render as generic unstyled inline content (or are dropped entirely depending on error recovery), silently losing both the semantic meaning and any styling that targeted the *correct* tag name.
- **A visual feature (like a "featured/highlighted plan" treatment) can be silently lost during a merge** if the modifier class isn't carried over along with the base content — worth explicitly re-checking that all prior functionality/polish survived the integration, not just that the content itself is present.
- **Consistent spacing rhythm across merged sections is a deliberate design decision, not automatic** — sections authored independently on different days will have differing padding/margin values by default; achieving a "designed as one page" feeling requires an explicit pass to standardize spacing (e.g. matching top and bottom padding within each section) after the content merge is otherwise complete.

---

## PHASE 2 COMPLETE (Days 11-20) 🎯
Key recurring concepts across Phase 2: CSS Grid (`auto-fit`/`minmax()`, `repeat()`, named `grid-template-areas`, and the requirement that Grid needs explicit column/row definitions unlike flexbox's defaults), media queries as explicit breakpoint-based responsiveness (contrasted with Grid's automatic `auto-fit` responsiveness), the checkbox hack and general sibling selector (`~`) for JS-free interactivity — including two real bugs where the checkbox and its target weren't true siblings — CSS 3D transforms (`perspective`, `preserve-3d`, `backface-visibility`), glassmorphism (`backdrop-filter`, layered `box-shadow` with `inset`), and — capping the phase — the practical, less glamorous but essential work of reconciling multiple independently-built components into one coherent, semantically-correct page.

---

## Day 21 — Light/Dark Mode Toggle

- **`document.querySelector(selector)`** finds and returns the first element matching a CSS-style selector, giving JavaScript a reference to manipulate it — reuses the same selector syntax already known from CSS (`.class`, `#id`, `tag`, etc.).
- **`.addEventListener('click', callback)`** attaches a function that runs every time the element is clicked. The callback is commonly written as an **arrow function** (`() => { ... }`) — a compact syntax for "code to run later."
- **`classList.toggle('name')` / `classList.contains('name')`** — the JS equivalent of CSS's state-driven selectors (`:hover`, `[open]`, `:checked`) used throughout Phases 1 and 2, except the state change is now explicitly triggered by script logic rather than a built-in browser interaction. `.toggle()` adds the class if absent, removes it if present; `.contains()` checks current state without changing it.
- **Critical syntax distinction: CSS selectors vs. JS class-name arguments.** In CSS, `.` prefixes a class selector (`.light-mode`). In JavaScript's `classList` methods, the argument is the bare class name only — no dot. Writing `classList.toggle('.light-mode')` (with the dot) creates/toggles a class literally named `.light-mode` (dot included in the name), which won't match a CSS rule like `body.light-mode { }`. A very common first-time mistake when moving between CSS and JS class manipulation.
- **`if`/`else` conditionals** — run one block or another based on whether a condition evaluates true or false; used here to swap the toggle button's icon based on current theme state.
- **`.textContent`** — reads or overwrites the text inside an element.
- **A missing/misspelled `<script>` attribute (`scr` instead of `src`) fails completely silently** — no console error, the file simply never loads, so none of the JS executes. This is a notably sneaky bug category since nothing in the browser flags it as wrong; `console.log` as a first debugging step is the reliable way to confirm whether a script loaded and ran at all, before debugging further into *why* something isn't working correctly.
- **`position: absolute` vs `position: fixed` for persistent UI elements:** `absolute` anchors to the nearest positioned ancestor and scrolls away with the page along with that ancestor; `fixed` anchors to the viewport itself and stays visually pinned regardless of scroll position. Elements meant to always be reachable (theme toggles, sticky navs, cookie banners) should use `fixed`, not `absolute`.
- **Payoff of the custom-properties (`var(--token)`) architecture from the redesign:** because every color across the entire site referenced a shared CSS variable rather than a hardcoded hex value, a single `body.light-mode { --bg-deep: ...; }` override block was sufficient to re-theme the whole page at once — validating that the token-based approach adopted during the UI redesign wasn't just stylistic, it was functionally necessary groundwork for this exact feature.

---

## Day 22 — Accordion (JS version)

- **`querySelectorAll` + `.forEach()`** — `querySelectorAll` returns *all* matching elements (unlike `querySelector`, which returns only the first), and `.forEach()` runs a callback once per element in that collection — the standard pattern for attaching identical event-handling logic to a repeated group of elements without duplicating code per item.
- **The "capture state before resetting" pattern:** when implementing "close everything, then open the clicked one" behavior, the open/closed state of the clicked item must be checked and stored *before* the reset loop runs — otherwise, by the time the check happens, the reset has already overwritten the very state being checked, making the click always take the same branch (a subtle logic-ordering bug, distinct from a syntax bug).
- **Colon (`:active`, `:hover`, `:checked`) vs. dot (`.active`, custom class) selectors are fundamentally different mechanisms** that can look superficially similar — `:active` is a *built-in* CSS pseudo-class representing a real-time browser state (true only while the mouse button is physically held down), while `.active` is an arbitrary custom class name with no built-in meaning, entirely defined by the developer. Confusing the two produces a selector that's syntactically valid but semantically wrong, matching a completely different (and usually much shorter-lived) condition than intended.
- **A class must be added to the same element that the corresponding CSS rule (and any state-check like `.classList.contains()`) actually targets.** Adding a class to one element (e.g. `header`) while checking/removing it on a different element (e.g. `item`) silently breaks the toggle logic, since the two references never actually observe each other's state.
- **Reinforced from Day 18: `display` cannot be transitioned/animated.** Toggling `display: none`/`block` to hide/show content defeats any `transition` set on other properties of that element, since the element doesn't exist in an animatable state until `display` flips — the fix is to rely on an animatable property alone (`max-height: 0` + `overflow: hidden`) for both hiding *and* revealing content, without any `display` toggling at all.
- **A border (or other property) set on an element that's meant to be fully collapsed via `max-height: 0` can still visibly render its edges** (e.g. a thin line), since `overflow: hidden` clips *content* but doesn't remove borders drawn on the element's own box — repositioning such styling onto a properly-sized parent wrapper (that itself fully collapses/expands) avoids the artifact.
- **DRY (Don't Repeat Yourself):** extracting duplicated logic (here, "close all accordion items") into one reusable named function and calling it from multiple event handlers, rather than copy-pasting the same loop in each handler — a foundational code-quality habit worth building early, even in small scripts.

---

## Day 23 — Tabs Component

- **`data-*` custom attributes + `.dataset`:** any HTML attribute prefixed `data-` (e.g. `data-tab="design"`) is automatically exposed on that element's `.dataset` object in JavaScript, accessed by the part after `data-` (`.dataset.tab`). Multi-word attribute names convert hyphen-case in HTML to camelCase in JS (`data-user-id` → `.dataset.userId`). This is the standard, built-in mechanism for attaching custom application data directly to elements, readable without any extra parsing.
- **Template literals (backticks) vs. regular quotes:** `${...}` interpolation syntax — embedding a live JS variable's value inside a string — only works inside backtick-delimited strings (`` `...` ``). Using regular single or double quotes with `${target}` inside them does *not* substitute the variable; JavaScript treats the whole `${target}` sequence as literal, inert text. A very common mistake when first learning dynamic string building, and one that fails silently (no error) rather than obviously.
- **Explicit `data-*` matching (vs. positional/index matching)** between a set of triggers and a set of targets makes the relationship self-documenting directly in the HTML and resilient to reordering — contrasted with assuming "3rd button controls 3rd panel," which breaks silently if elements are ever reordered or a new one inserted mid-list.
- **Multiple stacked bugs of different categories can coexist in the same feature**, requiring one full pass to identify and fix each: a wrong method call (`querySelector` vs `querySelectorAll`), a syntax/quoting issue (missing backticks), a selector-syntax omission (missing `.`), and a plain data-entry mismatch (misspelled `data-*` values not matching between HTML elements) — none of these bugs mask or relate to each other; each had to be found independently.
- **A structured elimination process for "code looks correct but nothing happens":** check whether *unrelated* functionality on the same page still works (rules in/out a page-wide fatal script error); manually verify element counts/selectors directly in the browser console (rules in/out "elements don't exist" as the cause); check whether the *listener* itself is firing at all via a diagnostic `console.log` as the very first action inside the handler (rules in/out "the handler never attached" vs "the handler ran but did the wrong thing"). This process is what correctly isolated the bug to something *outside* the code's actual logic.
- **A browser can silently continue serving a stale/cached version of a script file**, even after the source file has been correctly edited and saved on disk — meaning code that is genuinely, verifiably correct in the editor can still fail to execute as written if what the browser actually downloaded and is running is an older version. Hard-refreshing, using an incognito window, or (as a last resort) renaming/re-adding the file to force the dev server to treat it as new are all valid ways to rule this out. This is a distinct failure category from a logic or syntax bug — the code was right, but the browser wasn't running that code.

---

## Day 24 — Character Counter

- **The `input` event** fires on every change to a text field's content — every keystroke, paste, or deletion — making it the correct event for "live" behavior while typing. `click` would not fire at all during typing, since no click is occurring.
- **`.value` vs `.textContent` — two different properties for two different element categories:** form fields (`<input>`, `<textarea>`, `<select>`) expose their current user-entered content via `.value`; regular content elements (`<span>`, `<p>`, `<div>`, etc.) expose their visible text via `.textContent`. Using the wrong one doesn't throw an error, but silently fails to read/write the intended content — a "no error, just wrong result" class of bug, similar in spirit to earlier silent-failure bugs this course (mismatched classes, wrong selector types).
- **`else if`** provides a third (or more) branch in a conditional chain, checked only if all preceding `if`/`else if` conditions were false — used here for a three-tier "normal / warning / over-limit" character-count state.
- **`element.style.property = value`** sets an inline CSS style directly from JavaScript, which takes visual precedence over stylesheet rules (inline styles have high specificity). Setting it to an empty string (`''`) removes the inline override, letting the element fall back to whatever the actual stylesheet specifies — a clean way to "reset to default" without hardcoding a specific fallback color.
- **The native `maxlength` HTML attribute** on `<input>`/`<textarea>` physically prevents typing beyond a character limit at the browser level, with zero JavaScript required — worth using alongside a JS-driven live counter rather than attempting to block keystrokes manually in script, which would be unnecessarily complex for a solved problem.
- **Listening on a button's `click` vs. a form's `submit` event:** a form can be submitted two ways — clicking a `type="submit"` button, or pressing Enter while focused in a text field within that form. Both actions trigger the same underlying `submit` event on the `<form>` element itself, but only one of them (the button click) fires a `click` event on the button specifically. Attaching submission-handling logic to the button's `click` event misses the Enter-key path entirely; listening on the form's `submit` event (and calling `e.preventDefault()` there) reliably catches both interaction paths through a single shared listener.

---

## Day 25 — To-Do List (basic)

- **`document.createElement(tagName)`** creates a brand-new element entirely in memory — it does not appear on the page until explicitly inserted somewhere.
- **`.innerHTML` vs `.textContent`:** `.innerHTML` parses and inserts actual HTML markup (new tags, nested structure), while `.textContent` treats its input as plain literal text, escaping any tag-like characters rather than creating real elements from them. Building a new list item's internal structure (a `<span>` + a `<button>` in one go) requires `.innerHTML`, not `.textContent`.
- **`.appendChild(element)`** performs the actual insertion of a created (or moved) element into the DOM as the last child of the target — the missing final step that makes a `createElement`-built element actually visible.
- **`.trim()`** removes leading/trailing whitespace from a string — used to prevent a whitespace-only entry from being treated as valid content.
- **Event delegation:** dynamically created elements (like each new to-do's remove button) do not exist at page-load time, so attaching an individual listener to each one at page-load is impossible for elements created later. The standard solution is to attach a *single* listener to a stable, always-present parent container, and inside that handler inspect `e.target` (the actual element that was clicked) to determine what specific action to take — this correctly handles clicks on any current *or future* dynamically-added child, without needing to re-attach listeners every time new elements are created.
- **`.closest(selector)`** walks upward from a given element through its ancestors, returning the nearest one matching the selector — used here to go from a clicked "×" button up to its containing `.todo-item`, so the whole task row (not just the button) can be removed.

---

## Day 26 — Image Slider/Carousel

- **A single piece of shared state must have exactly one source of truth**, even when multiple different triggers (buttons, dots, a timer) need to read and update it. Tracking the same conceptual value (e.g. "which slide is currently active") in multiple separate variables — one per trigger — causes those triggers to silently desynchronize from one another, since updating one variable has no effect on the others. The fix is routing every trigger through one shared function that reads and writes a single variable, so all interaction paths stay consistent no matter the order or combination of actions taken.
- **An undeclared variable (no `let`/`const`/`var`) becomes an implicit global** when assigned to — this is legal but poor practice, and was itself a symptom of the state-desync bug above (a "hidden" fourth tracking variable nobody intended to create).
- **`transition` vs `animation`:** `transition` smoothly interpolates a real CSS property between two states over time (triggered by a state change like `:hover` or a class toggle) and requires an actual property name as its target. `animation` plays a named `@keyframes` sequence and is the correct property to use when invoking predefined keyframes — supplying a keyframe name to `transition` (instead of `animation`) is invalid and silently ignored, a "looks right, does nothing" class of bug consistent with several earlier ones this course (invalid `font-weight` values, `backdrop-filter` percentage units, etc.).
- **`.childNodes` vs `.children`:** `.childNodes` returns *all* child nodes of an element, including text nodes (such as whitespace/line breaks between tags in the HTML source) — `.children` returns only actual element nodes. Code relying on `.childNodes` to iterate over "the child elements" can work by coincidence in tightly-formatted HTML (no whitespace between tags) but break the moment that HTML is reformatted normally, since text nodes don't have properties like `.classList` that element-only code expects. `.children` is the more robust choice whenever only actual elements are intended.
- **The two-argument form of `classList.toggle(className, condition)`** forces a class to be present or absent based on a boolean, rather than blindly flipping its current state — often a cleaner and more correct choice than a manual `if (condition) { add } else { remove }` block, especially when the "correct" state needs to be explicitly computed (like "is this the active slide index") rather than simply flipped.

---

## Day 27 — *(upcoming)*
*To be filled in when started.*
