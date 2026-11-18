---
title: "Puzzle Workshop"
description: "Practice Blockzzle, Ringzzle, and DaySudoku with three illustrated scenarios and three follow-up variations, each with a hint and answer."
date: 2026-11-18T21:49:00+09:00
url: "/games/practice/"
practiceBoards: true
workshopShareSections:
  - blockzzle-crossing-lines
  - ringzzle-distant-slot
  - daysudoku-box-to-row
  - blockzzle-after-clear
  - ringzzle-blue-slot
  - daysudoku-different-rows
---

Three practice situations for your next puzzle break: complete two lines with one block, free a distant ring slot, and rule out a Sudoku candidate. These are invented examples, not positions from your current game.

Already tried the examples? [Try a variation](#try-a-variation) to see how one change can affect the next move.

## Blockzzle: Complete two lines {#blockzzle-crossing-lines}

Row 2 is missing exactly two adjacent squares. One of those squares is also the only empty square in its column. You can place a horizontal two-square block into the row's two gaps, or use a single-square block in the gap shared by the row and column.

{{< practice-board caption="Blockzzle example board" >}}
{
  "columns": ["A", "B", "C", "D"],
  "rows": [
    {"label": "1", "cells": ["Filled", "Filled", "Empty", "Empty"]},
    {"label": "2", "cells": ["Filled", "Empty", "Empty", "Filled"]},
    {"label": "3", "cells": ["Empty", "Filled", "Filled", "Empty"]},
    {"label": "4", "cells": ["Empty", "Filled", "Empty", "Filled"]}
  ]
}
{{< /practice-board >}}

Both moves are legal. Which clears both the row and the column in a single placement?

{{< move-check label="Check the Blockzzle answer" hintLabel="Blockzzle hint" hint="Check the completed row and column separately. Does either gap remain empty after the placement?" variation="#blockzzle-after-clear" variationLabel="Try the Blockzzle variation" next="/games/blockzzle/#move-check-1" nextLabel="More Blockzzle practice" >}}
**Use the two-square block.** It fills both row gaps, and one of its squares also fills the column's last gap. The single-square block completes the column, but the row still has an empty square at the moment the column clears.
{{< /move-check >}}

## Ringzzle: Free a distant slot {#ringzzle-distant-slot}

A medium red ring has two possible placements. In spot A it completes a red row. In spot B it joins small and large red rings in the same cell to trigger Color Burst.

{{< practice-board caption="Ringzzle ring slots: S = small, L = large" >}}
{
  "columns": ["Left", "Middle", "Right"],
  "emphasis": ["A: empty", "B: red S + L", "Target: red L"],
  "rows": [
    {"label": "1", "cells": ["Red S", "A: empty", "Red L"]},
    {"label": "2", "cells": ["B: red S + L", "Empty", "Empty"]},
    {"label": "3", "cells": ["Empty", "Target: red L", "Empty"]}
  ]
}
{{< /practice-board >}}

Elsewhere, outside that row, a large red ring occupies the slot you want to free. Assuming no other clears, which placement frees that slot?

{{< move-check label="Check the Ringzzle answer" hintLabel="Ringzzle hint" hint="Compare the area affected by a color line with the area affected by a Color Burst." variation="#ringzzle-blue-slot" variationLabel="Try the Ringzzle variation" next="/games/ringzzle/#move-check-1" nextLabel="More Ringzzle practice" >}}
**Choose spot B.** Color Burst clears red rings across the board, including the distant large red ring. The red row in spot A would only clear its matching rings.
{{< /move-check >}}

## DaySudoku: Narrow a candidate {#daysudoku-box-to-row}

In the top-middle 3x3 box, a 7 can go in only two cells: row 2, column 4 or row 2, column 6. Outside that box, row 2, column 8 also has 7 on its candidate list.

{{< practice-board caption="DaySudoku candidate 7; column 8 is outside the box" >}}
{
  "columns": ["4", "5", "6", "8"],
  "emphasis": ["Possible"],
  "rows": [
    {"label": "1", "cells": ["No", "No", "No", "Not shown"]},
    {"label": "2", "cells": ["Possible", "No", "Possible", "Possible"]},
    {"label": "3", "cells": ["No", "No", "No", "Not shown"]}
  ]
}
{{< /practice-board >}}

Can you remove 7 from row 2, column 8 without deciding which of the two box cells is correct?

{{< move-check label="Check the DaySudoku answer" hintLabel="DaySudoku hint" hint="Look for what the two possibilities share. Does choosing either one force the 7 into the same row?" variation="#daysudoku-different-rows" variationLabel="Try the DaySudoku variation" next="/games/daysudoku/#move-check-1" nextLabel="More DaySudoku practice" >}}
**Yes.** The box must contain a 7 and both possible cells are in row 2. Either placement puts that row's 7 inside the box. So 7 cannot appear again in row 2, column 8, even though you do not yet know the exact cell.
{{< /move-check >}}

## Try a variation {#try-a-variation}

### Blockzzle: Look again after a clear {#blockzzle-after-clear}

Return to the [Blockzzle board](#blockzzle-crossing-lines). This time, put the single-square block at B2 first. Column B clears. The two-square block is still available, and no other line has cleared. Can you now place it across B2 and C2 to complete row 2?

{{< move-check label="Check the placement answer" hintLabel="Placement hint" hint="Check whether the piece you just placed is still on the board after its column clears." >}}
**Yes, the same gap is open again.** The column clear leaves B2 empty and C2 was already empty. A horizontal two-square block can then fill both cells and complete row 2. The two moves clear the two lines separately.
{{< /move-check >}}

### Ringzzle: Check the remaining size {#ringzzle-blue-slot}

On the [Ringzzle board](#ringzzle-distant-slot), imagine the target cell holds a small blue ring as well as its large red ring. You place the medium red ring at B and trigger the red Color Burst. Assuming no other clear, can the target cell now accept another small ring?

{{< move-check label="Check the slot answer" hintLabel="Slot hint" hint="Check which color clears, then look at the specific size slot needed by the next ring." >}}
**No, the small slot is still occupied.** The red Color Burst frees the large slot but does not remove the small blue ring. A free large slot cannot take a small ring.
{{< /move-check >}}

### DaySudoku: Check both rows {#daysudoku-different-rows}

Change the [DaySudoku example](#daysudoku-box-to-row): the box's only two places for 7 are now row 2, column 4 and row 3, column 6. Row 2, column 8 still lists 7. Is this information alone enough to cross off 7 there?

{{< move-check label="Check the candidate answer" hintLabel="Candidate hint" hint="Try each possible place for the box's 7. Do both choices still put a 7 in row 2?" >}}
**No, the two positions are in different rows.** If the box's 7 goes in row 3, column 6, that placement does not rule out row 2, column 8. Another constraint might eliminate it, but the box does not force that conclusion.
{{< /move-check >}}
