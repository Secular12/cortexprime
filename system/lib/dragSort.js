export const addDragSort = ($dragSortHandle, callback) => {
  $dragSortHandle.setAttribute('draggable', true)
  $dragSortHandle.ondrag = handleItemDrag
  $dragSortHandle.ondragend = event => handleItemDrop(event, callback)
}

export const dragSort = ($html, callback) => {
  $html
    .querySelectorAll('.drag-sort-handle')
    .forEach($dragSortHandle => addDragSort($dragSortHandle, callback))
}

export const handleItemDrag = event => {
  const $dragSortItem = event.currentTarget.closest('.drag-sort-item')
  const $dragSortList = $dragSortItem.parentNode

  const xPos = event.clientX
  const yPos = event.clientY

  $dragSortItem.classList.add('drag-sort-item--active')

  const $swapItem = document.elementFromPoint(xPos, yPos) ?? $selectedItem

  if ($dragSortList === $swapItem.parentNode) {
    const $dragSortSwapItem = $swapItem !== $dragSortItem.nextSibling
      ? $swapItem
      : $swapItem.nextSibling

    $dragSortList.insertBefore($dragSortItem, $dragSortSwapItem)
  }
}

export const handleItemDrop = (event, callback) => {
  const $dragSortItem = event.target.closest('.drag-sort-item')

  $dragSortItem
    .classList
    .remove('drag-sort-item--active')

  callback($dragSortItem.parentNode)
}
