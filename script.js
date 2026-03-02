var formBox = document.querySelector(".formBox");
var btnToCancelForm = document.querySelector(".form-cancel-button");
var addBtn = document.querySelector("#add");
if (addBtn) {
    addBtn.addEventListener("click", function () {
        formBox.classList.add("active-popup");
    });
}
if (btnToCancelForm) {
    btnToCancelForm.addEventListener("click", function () {
        formBox.classList.remove("active-popup");
    });
}
// key for the data local storage tabele
var key = "tableData";
function saveData() {
    localStorage.setItem(key, JSON.stringify(tData));
}
function addRowData(id, doctitle, formStatus, docAddEditDate) {
    tData.push({ id: id, doctitle: doctitle, formStatus: formStatus, docAddEditDate: docAddEditDate });
    saveData();
}
function onFormSubmit() {
    var docTitleInput = document.querySelector("#documentTitle").value;
    var formStatusSelect = document.querySelector("#formStatus").value;
    var docAddEditDate = Date.now();
    var indexVal = document.querySelector("#formStatus").selectedIndex;
    if (docTitleInput.trim() === "" || indexVal === 0) {
        alert("empty Fields");
        return;
    }
    var doctitle = DOMPurify.sanitize(docTitleInput);
    var formStatus = DOMPurify.sanitize(formStatusSelect);
    if (editRowId) {
        upDateRowData(doctitle, formStatus, docAddEditDate);
    }
    else {
        var id = Date.now();
        addRowData(id, doctitle, formStatus, docAddEditDate);
    }
    rowInsert();
    formReset();
    location.reload();
    return;
}
function rowInsert() {
    var tBody = document.querySelector("tbody");
    if (tBody) {
        tBody.innerHTML = "";
    }
    dataRender(tData);
    formBox.classList.remove("active-popup");
}
function formReset() {
    var ele1 = document.querySelector("documentTitle");
    if (ele1) {
        ele1.value = "";
    }
    var ele2 = document.querySelector("formStatus");
    if (ele2) {
        ele2.selectedIndex = 0;
    }
}
var tData = [];
var dataInLocalStorage = localStorage.getItem(key);
if (dataInLocalStorage) {
    try {
        tData = JSON.parse(dataInLocalStorage) || [];
    }
    catch (error) {
        console.error("Error Occurred");
    }
}
// Dataa render function
function dataRender(data) {
    data.forEach(function (element) {
        var table = document.querySelector(".content-table tbody");
        if (table) {
            // new tr Ele
            var newRow = table.insertRow();
            newRow.id = String(element.id);
            // cell 0
            var cell0 = newRow.insertCell(0);
            cell0.innerHTML = "<input id=\"".concat(element.id, "\" type=\"checkbox\">");
            // cell 1
            var cell1 = newRow.insertCell(1);
            cell1.textContent = element.doctitle;
            cell1.classList.add("titleText");
            // cell 2
            var cell2 = newRow.insertCell(2);
            var statusWrapper = document.createElement("div");
            var statusSpan = document.createElement("span");
            statusSpan.textContent = element.formStatus;
            if (element.formStatus === "Completed") {
                statusSpan.classList.add("status-completed");
                statusWrapper.appendChild(statusSpan);
            }
            else if (element.formStatus === "Needs Signing") {
                statusSpan.classList.add("status-needsSigning");
                statusWrapper.appendChild(statusSpan);
            }
            else if (element.formStatus === "Pending") {
                statusSpan.classList.add("status-pill");
                var subText = document.createElement("div");
                subText.innerHTML = "Waiting for <strong>1 person</strong>";
                subText.classList.add("pending-subtext");
                statusWrapper.appendChild(statusSpan);
                statusWrapper.appendChild(subText);
                statusWrapper.classList.add("status-wrapper");
            }
            cell2.appendChild(statusWrapper);
            // Date / time
            var cell3 = newRow.insertCell(3);
            var formattedDate = new Date(element.docAddEditDate);
            var formattedOnlyDate = formattedDate.toLocaleDateString("en-GB");
            var currTime = formattedDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
            cell3.appendChild(document.createTextNode(formattedOnlyDate));
            cell3.appendChild(document.createElement("br"));
            var timeSpan = document.createElement("span");
            timeSpan.textContent = currTime;
            timeSpan.style.fontSize = "16px";
            cell3.classList.add("date");
            cell3.appendChild(timeSpan);
            cell3.classList.add("cell3CSS");
            var cell4 = newRow.insertCell(4);
            var wrapBtnIcon = document.createElement("div");
            wrapBtnIcon.classList.add("wrapBtnIcon");
            var actionButton = document.createElement("button");
            if (element.formStatus === "Completed") {
                actionButton.textContent = "Download";
            }
            else if (element.formStatus === "Pending") {
                actionButton.textContent = "Preview";
            }
            else if (element.formStatus === "Needs Signing") {
                actionButton.textContent = "Sign Now";
            }
            actionButton.classList.add("btn5");
            var menuBtn = document.createElement("button");
            menuBtn.classList.add("menubtn1");
            var img = document.createElement("img");
            img.src = "images/menuIcon.svg";
            img.classList.add("imgInTable");
            menuBtn.appendChild(img);
            var dropdown_1 = document.createElement("div");
            dropdown_1.classList.add("dropdown-menu");
            dropdown_1.style.display = "none";
            var editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.id = String(element.id);
            editBtn.classList.add("edit-btn");
            var deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.id = String(element.id);
            deleteBtn.classList.add("delete-btn");
            dropdown_1.appendChild(editBtn);
            dropdown_1.appendChild(deleteBtn);
            wrapBtnIcon.appendChild(actionButton);
            wrapBtnIcon.appendChild(menuBtn);
            wrapBtnIcon.appendChild(dropdown_1);
            cell4.appendChild(wrapBtnIcon);
            menuBtn.addEventListener("click", function (e) {
                e.stopPropagation(); // to prevnt Event Bubling
                document
                    .querySelectorAll(".dropdown-menu")
                    .forEach(function (d) {
                    if (d !== dropdown_1) {
                        d.style.display = "none";
                    }
                });
                // toggle the currnt dropdown
                dropdown_1.style.display =
                    dropdown_1.style.display === "none" ? "block" : "none";
            });
            document.addEventListener("click", function () {
                dropdown_1.style.display = "none";
            });
        }
    });
}
// Search data rendering functionality
function searchFunction() {
    var searchInput = document.querySelector("#searchInput");
    if (searchInput) {
        var searchInputValue_1 = searchInput.value.trim().toLowerCase();
        var searchData = tData.filter(function (ele) {
            return String(ele.doctitle).trim().toLowerCase() ===
                String(searchInputValue_1).toLowerCase();
        });
        if (searchInputValue_1.length === 0 && searchData.length === 0) {
            searchDataRender(tData);
        }
        else if (searchInputValue_1.length > 0 && searchData.length > 0) {
            searchDataRender(searchData);
        }
        else if (searchInputValue_1.length > 0 && searchData.length === 0) {
            alert("No matched item");
        }
    }
}
function reloadWindowAfterAlert() {
    alert("No matched item");
    window.location.reload();
}
function searchDataRender(searchData) {
    var tBody = document.querySelector("tBody");
    if (tBody) {
        tBody.innerHTML = "";
    }
    dataRender(searchData);
}
// Multi Delete Functionality
var multiDeleteBtn = document.querySelector("#multiDelete");
if (multiDeleteBtn) {
    multiDeleteBtn.addEventListener("click", function () {
        // All delets using one main table checkbox
        var selectAllCheckbox = document.querySelector("#selectAllCheckbox");
        var selectAllCheckboxValue = selectAllCheckbox === null || selectAllCheckbox === void 0 ? void 0 : selectAllCheckbox.checked;
        if (selectAllCheckboxValue) {
            var checkBoxes_1 = document.querySelectorAll('table input[type="checkbox"]');
            if (checkBoxes_1.length === 1) {
                alert("Add atleast one row");
                return;
            }
            checkBoxes_1.forEach(function (cBox) {
                cBox.checked = true;
            });
        }
        var checkBoxes = document.querySelectorAll('table input[type="checkbox"]:checked');
        if (checkBoxes.length === 0) {
            alert("Select atleast one row");
            return;
        }
        //  nodeLis
        var checkBoxesIds = Array.from(checkBoxes, function (ele) { return ele.id; });
        tData = tData.filter(function (ele) { return !checkBoxesIds.includes(String(ele.id)); });
        saveData();
        rowInsert();
    });
}
// Edit Functionality
var editRowId = null;
var tableBody = document.querySelector(".content-table tbody");
if (tableBody) {
    tableBody.addEventListener("click", function (e) {
        var target = e.target;
        if (target instanceof HTMLElement) {
            var editBtn = target.closest(".edit-btn");
            if (editBtn) {
                editRowId = editBtn.id;
                putDataInForm(editRowId);
                formBox.classList.add("active-popup");
            }
            var deleteBtn = target.closest(".delete-btn");
            if (deleteBtn) {
                var deleteBtnId_1 = deleteBtn.id;
                tData = tData.filter(function (ele) { return !deleteBtnId_1.includes(String(ele.id)); });
                saveData();
                rowInsert();
            }
        }
    });
}
function putDataInForm(btnId) {
    tData.forEach(function (ele) {
        if (String(ele.id) === btnId) {
            var docTitleInput = document.querySelector("#documentTitle");
            var formStatusInput = document.querySelector("#formStatus");
            if (docTitleInput) {
                docTitleInput.value = ele.doctitle;
            }
            if (formStatusInput) {
                formStatusInput.value = ele.formStatus;
            }
        }
    });
}
function upDateRowData(doctitle, formStatus, docAddEditDate) {
    var row = tData.find(function (ele) { return String(ele.id) === String(editRowId); });
    // row not found
    if (!row)
        return;
    row.doctitle = doctitle;
    row.formStatus = formStatus;
    row.docAddEditDate = docAddEditDate;
    saveData();
    formReset();
    editRowId = null;
}
window.addEventListener("load", function () {
    dataRender(tData);
});
