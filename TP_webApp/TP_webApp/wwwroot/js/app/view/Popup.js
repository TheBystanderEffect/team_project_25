export function createPopup(input) {
    var cuisines = ["Chinese", "Indian"];
    var sel = document.getElementById('exampleSelect1');
    var fragment = document.createDocumentFragment();
    cuisines.forEach(function (cuisine, index) {
        var opt = document.createElement('option');
        opt.innerHTML = cuisine;
        opt.value = cuisine;
        fragment.appendChild(opt);
    });
    sel.appendChild(fragment);
    // $('#popupWindow').trigger('click');
    return null;
}
export function savePopup() {
}
//# sourceMappingURL=Popup.js.map