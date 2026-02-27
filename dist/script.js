"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
let formBox = document.querySelector(".formBox");
let btnToCancelForm = document.querySelector(".form-cancel-button");
let addBtn = document.querySelector("#add");
if (addBtn) {
    addBtn.addEventListener("click", () => {
        formBox.classList.add("active-popup");
    });
}
if (btnToCancelForm) {
    btnToCancelForm.addEventListener("click", () => {
        formBox.classList.remove("active-popup");
    });
}
// key for the data local storage tabele
const key = "tableData";
function saveData() {
    localStorage.setItem(key, JSON.stringify(tData));
}
function addRowData(id, doctitle, formStatus, docAddEditDate) {
    tData.push({ id, doctitle, formStatus, docAddEditDate });
    saveData();
}
function onFormSubmit() {
    const doctitle = document.querySelector("#documentTitle").value;
    const formStatus = document.querySelector("#formStatus").value;
    const docAddEditDate = Date.now();
    let indexVal = document.querySelector("#formStatus").selectedIndex;
    if (doctitle.trim() === "" || indexVal === 0) {
        alert("empty Fields");
        return;
    }
    if (editRowId) {
        upDateRowData(doctitle, formStatus, docAddEditDate);
    }
    else {
        const id = Date.now();
        addRowData(id, doctitle, formStatus, docAddEditDate);
    }
    rowInsert();
    formReset();
    return;
}
function rowInsert() {
    const tBody = document.querySelector("tbody");
    if (tBody) {
        tBody.innerHTML = "";
    }
    dataRender(tData);
    formBox.classList.remove("active-popup");
}
function formReset() {
    let ele1 = document.querySelector('documentTitle');
    if (ele1) {
        ele1.value = "";
    }
    let ele2 = document.querySelector('formStatus');
    if (ele2) {
        ele2.selectedIndex = 0;
    }
}
let tData = [];
const dataInLocalStorage = localStorage.getItem(key);
if (dataInLocalStorage) {
    try {
        tData = JSON.parse(dataInLocalStorage);
    }
    catch (error) {
        console.error("Error Occurred");
    }
}
// Dtya render function
function dataRender(data) {
    data.forEach((element) => {
        const table = document.querySelector(".content-table tbody");
        if (table) {
            // new tr Ele
            const newRow = table.insertRow();
            newRow.id = String(element.id);
            // cell 0
            const cell0 = newRow.insertCell(0);
            cell0.innerHTML = `<input id="${element.id}" type="checkbox">`;
            // cell 1
            const cell1 = newRow.insertCell(1);
            cell1.textContent = element.doctitle;
            cell1.classList.add("titleText");
            // cell 2
            const cell2 = newRow.insertCell(2);
            const statusWrapper = document.createElement("div");
            const statusSpan = document.createElement("span");
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
                const subText = document.createElement("div");
                subText.innerHTML = `Waiting for <strong>1 person</strong>`;
                subText.classList.add("pending-subtext");
                statusWrapper.appendChild(statusSpan);
                statusWrapper.appendChild(subText);
                statusWrapper.classList.add('status-wrapper');
            }
            cell2.appendChild(statusWrapper);
            // Date / time
            const cell3 = newRow.insertCell(3);
            const formattedDate = new Date(element.docAddEditDate);
            const formattedOnlyDate = formattedDate.toLocaleDateString("en-GB");
            const currTime = formattedDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
            cell3.appendChild(document.createTextNode(formattedOnlyDate));
            cell3.appendChild(document.createElement("br"));
            const timeSpan = document.createElement("span");
            timeSpan.textContent = currTime;
            timeSpan.style.fontSize = "16px";
            cell3.classList.add("date");
            cell3.appendChild(timeSpan);
            cell3.classList.add("cell3CSS");
            const cell4 = newRow.insertCell(4);
            const wrapBtnIcon = document.createElement("div");
            wrapBtnIcon.classList.add("wrapBtnIcon");
            const actionButton = document.createElement("button");
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
            let menuBtn = document.createElement("button");
            menuBtn.classList.add("menubtn1");
            const img = document.createElement("img");
            img.src = "images/menuIcon.svg";
            img.classList.add("imgInTable");
            menuBtn.appendChild(img);
            const dropdown = document.createElement("div");
            dropdown.classList.add("dropdown-menu");
            dropdown.style.display = "none";
            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.id = String(element.id);
            editBtn.classList.add("edit-btn");
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.id = String(element.id);
            deleteBtn.classList.add("delete-btn");
            dropdown.appendChild(editBtn);
            dropdown.appendChild(deleteBtn);
            wrapBtnIcon.appendChild(actionButton);
            wrapBtnIcon.appendChild(menuBtn);
            wrapBtnIcon.appendChild(dropdown);
            cell4.appendChild(wrapBtnIcon);
            menuBtn.addEventListener("click", (e) => {
                e.stopPropagation(); // to prevnt Event Bubling
                document
                    .querySelectorAll(".dropdown-menu")
                    .forEach((d) => {
                    if (d !== dropdown) {
                        d.style.display = "none";
                    }
                });
                // toggle the currnt dropdown
                dropdown.style.display =
                    dropdown.style.display === "none" ? "block" : "none";
            });
            document.addEventListener("click", () => {
                dropdown.style.display = "none";
            });
        }
    });
}
// Search data rendering functionality
function searchFunction() {
    let searchInput = document.querySelector("#searchInput");
    if (searchInput) {
        const searchInputValue = searchInput.value.trim().toLowerCase();
        let searchData = tData.filter((ele) => String(ele.doctitle).trim().toLowerCase() ===
            String(searchInputValue).toLowerCase());
        if (searchInputValue.length === 0 && searchData.length === 0) {
            searchDataRender(tData);
        }
        else if (searchInputValue.length > 0 && searchData.length > 0) {
            searchDataRender(searchData);
        }
        else if (searchInputValue.length > 0 && searchData.length === 0) {
            alert("No matched item");
            dataRender(tData);
        }
    }
}
function searchDataRender(searchData) {
    let tBody = document.querySelector("tBody");
    if (tBody) {
        tBody.innerHTML = "";
    }
    dataRender(searchData);
}
// Multi Delete Functionality
let multiDeleteBtn = document.querySelector("#multiDelete");
if (multiDeleteBtn) {
    multiDeleteBtn.addEventListener("click", () => {
        const checkBoxes = document.querySelectorAll('table input[type="checkbox"]:checked');
        if (checkBoxes.length === 0) {
            alert("Add atleast one row");
            return;
        }
        //  nodeLis
        const checkBoxesIds = Array.from(checkBoxes, (ele) => ele.id);
        tData = tData.filter((ele) => !checkBoxesIds.includes(String(ele.id)));
        saveData();
        rowInsert();
    });
}
// Edit Functionality
let editRowId = null;
const tableBody = document.querySelector(".content-table tbody");
if (tableBody) {
    tableBody.addEventListener("click", function (e) {
        const editBtn = e.target.closest(".edit-btn");
        if (editBtn) {
            editRowId = editBtn.id;
            putDataInForm(editRowId);
            formBox.classList.add("active-popup");
        }
        const deleteBtn = e.target.closest(".delete-btn");
        if (deleteBtn) {
            let deleteBtnId = deleteBtn.id;
            tData = tData.filter((ele) => !deleteBtnId.includes(String(ele.id)));
            saveData();
            rowInsert();
        }
    });
}
function putDataInForm(btnId) {
    tData.forEach((ele) => {
        if (String(ele.id) === btnId) {
            const docTitleInput = document.getElementById("documentTitle");
            const formStatusInput = document.getElementById("formStatus");
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
    const row = tData.find((ele) => String(ele.id) === String(editRowId));
    if (!row)
        return; // row not found
    row.doctitle = doctitle;
    row.formStatus = formStatus;
    row.docAddEditDate = docAddEditDate;
    saveData();
    formReset();
    editRowId = null;
}
window.addEventListener("load", () => {
    dataRender(tData);
});
//# sourceMappingURL=script.js.map