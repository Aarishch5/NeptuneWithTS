let formBox = document.querySelector<HTMLDivElement>(".formBox");

let btnToCancelForm = document.querySelector<HTMLButtonElement>(
  ".form-cancel-button",
);
let addBtn = document.querySelector<HTMLButtonElement>("#add");

const formStatusObj={
  pending:"Pending",
  needsSigning:"Needs Signing",
  completed:"Completed"
}

if (addBtn && formBox) {
  addBtn.addEventListener("click", () => {
    formBox.classList.add("active-popup");
  });
}

if (btnToCancelForm && formBox) {
  btnToCancelForm.addEventListener("click", () => {
    formBox.classList.remove("active-popup");
    const docTitleInput =
    document.querySelector<HTMLInputElement>("#documentTitle");
  const formStatusSelect =
    document.querySelector<HTMLSelectElement>("#formStatus");
  const personWaitingInput =
    document.querySelector<HTMLInputElement>("#personPending");
  const formStatusValue = formReset(
    docTitleInput,
    formStatusSelect,
    personWaitingInput,
  );
  });
}

declare const DOMPurify: {
  sanitize: (dirty: string, config?: any) => string;
};

// key for the data local storage tabele
const key: string = "tableData";

function saveData() {
  localStorage.setItem(key, JSON.stringify(tData));
}

function addRowData(
  id: number,
  doctitle: string,
  formStatus: string,
  docAddEditDate: number,
  personWaiting: number | null,
) {
  tData.push({ id, doctitle, formStatus, docAddEditDate, personWaiting });
  saveData();
}


function onFormSubmit() {
  const docTitleInput =
    document.querySelector<HTMLInputElement>("#documentTitle");
  const docTitle = docTitleInput?.value;
  const formStatusSelect =
    document.querySelector<HTMLSelectElement>("#formStatus");
  const formStatusValue =
    document.querySelector<HTMLSelectElement>("#formStatus")?.value;

  const docAddEditDate: number = Date.now();
  let indexVal: number = -1;

  const personWaitingInput =
    document.querySelector<HTMLInputElement>("#personPending");

  let personWaiting: number | null = null;

  if (formStatusValue === formStatusObj.pending && personWaitingInput?.value) {
    personWaiting = Number(personWaitingInput.value);
  }

  let index1 = document.querySelector<HTMLSelectElement>("#formStatus");
  if (index1) {
    indexVal = index1?.selectedIndex;
  }

  if (docTitle?.trim() === "" || indexVal === 0) {
    alert("empty Fields");
    return;
  }

  const doctitle: string = DOMPurify.sanitize(docTitle || "");
  if (formStatusValue) {
    const formStatus: string = DOMPurify.sanitize(formStatusValue);
    if (editRowId) {
      upDateRowData(doctitle, formStatus, docAddEditDate, personWaiting);
    } else {
      const id: number = Date.now();
      addRowData(id, doctitle, formStatus, docAddEditDate, personWaiting);
    }
  }

  rowInsert();
  formReset(docTitleInput, formStatusSelect, personWaitingInput);

  return;
}

function rowInsert() {
  const tBody = document.querySelector<HTMLTableSectionElement>("tbody");
  if (tBody) {
    tBody.innerHTML = "";
  }
  dataRender(tData);
  if (formBox) {
    formBox.classList.remove("active-popup");
  }
}

const input2Div = document.querySelector<HTMLDivElement>("#input2");
const formStatus = document.querySelector<HTMLSelectElement>("#formStatus");
const personWaitingInput =
  document.querySelector<HTMLInputElement>("#personPending");

if (formStatus && input2Div) {
  const toggleInput2 = () => {
    if (formStatus.value === "Pending") {
      input2Div.style.display = "block";
    } else {
      input2Div.style.display = "none";
    }
  };

  toggleInput2();

  formStatus.addEventListener("change", toggleInput2);

  if (personWaitingInput) {
    personWaitingInput.addEventListener("input", () => {
      console.log("Person Waiting:", personWaitingInput.value);
    });
  }
}

function formReset(
  ele1: HTMLInputElement | null,
  ele2: HTMLSelectElement | null,
  ele3: HTMLInputElement | null,
) {
  console.log({ ele1 });
  if (ele1) {
    ele1.value = "";
  }

  if (ele2) {
    ele2.selectedIndex = 0;
  }

  if (ele3) {
    ele3.value = "";
  }
  if (input2Div) {
    input2Div.style.display = "none";
  }
}

type dataSet = {
  id: number;
  doctitle: string;
  formStatus: string;
  docAddEditDate: number;
  personWaiting: number | null;
};

let tData: dataSet[] = [];

const dataInLocalStorage = localStorage.getItem(key);
if (dataInLocalStorage) {
  try {
    tData = JSON.parse(dataInLocalStorage) || [];
  } catch (error) {
    console.error("Error Occurred");
  }
}

// Dataa render function

function dataRender(data: dataSet[]) {
  data.forEach((element) => {
    const table = document.querySelector<HTMLTableSectionElement>(
      ".content-table tbody",
    );

    const aboutConfig: Record<
      string,
      {
        className: string;
        buttonText: string;
        subText?: string;
        persons?: number;
      }
    > = {
      Completed: {
        className: "status-completed",
        buttonText: "Download",
      },
      "Needs Signing": {
        className: "status-needsSigning",
        buttonText: "Sign Now",
      },
      Pending: {
        className: "status-pill",
        buttonText: "Preview",
      },
    };

    if (table) {
      const newRow: HTMLTableRowElement = table.insertRow();
      newRow.id = String(element.id);

      // cell 0
      const cell0: HTMLTableCellElement = newRow.insertCell(0);
      cell0.innerHTML = `<input id="${element.id}" type="checkbox">`;

      // cell 1
      const cell1: HTMLTableCellElement = newRow.insertCell(1);
      cell1.textContent = element.doctitle;
      cell1.classList.add("titleText");

      // cell 2:
      const cell2: HTMLTableCellElement = newRow.insertCell(2);
      const statusWrapper: HTMLDivElement = document.createElement("div");

      const statusSpan: HTMLSpanElement = document.createElement("span");
      const config = aboutConfig[element.formStatus];

      statusSpan.textContent = element.formStatus;
      if (config) {
        statusSpan.classList.add(config.className);
        statusWrapper.appendChild(statusSpan);

        if (
          element.formStatus === "Pending" &&
          element.personWaiting !== null
        ) {
          const subText = document.createElement("div");
          subText.innerHTML = `Waiting for <strong>${element.personWaiting} person</strong>`;
          subText.classList.add("pending-subtext");
          statusWrapper.appendChild(subText);
          statusWrapper.classList.add("status-wrapper");
        }
      }

      cell2.appendChild(statusWrapper);

      // Date / time
      const cell3: HTMLTableCellElement = newRow.insertCell(3);
      const formattedDate: Date = new Date(element.docAddEditDate);

      const formattedOnlyDate: string =
        formattedDate.toLocaleDateString("en-GB");
      const currTime: string = formattedDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      cell3.appendChild(document.createTextNode(formattedOnlyDate));
      cell3.appendChild(document.createElement("br"));
      const timeSpan: HTMLSpanElement = document.createElement("span");
      timeSpan.textContent = currTime;
      timeSpan.style.fontSize = "16px";

      cell3.classList.add("date");
      cell3.appendChild(timeSpan);
      cell3.classList.add("cell3CSS");

      const cell4: HTMLTableCellElement = newRow.insertCell(4);
      const wrapBtnIcon: HTMLDivElement = document.createElement("div");
      wrapBtnIcon.classList.add("wrapBtnIcon");

      const actionButton: HTMLButtonElement = document.createElement("button");
      if (config) {
        actionButton.textContent = config.buttonText;
      }

      actionButton.classList.add("btn5");

      let menuBtn: HTMLButtonElement = document.createElement("button");
      menuBtn.classList.add("menubtn1");

      const img: HTMLImageElement = document.createElement("img");
      img.src = "images/menuIcon.svg";
      img.classList.add("imgInTable");

      menuBtn.appendChild(img);

      const dropdown: HTMLDivElement = document.createElement("div");
      dropdown.classList.add("dropdown-menu");
      dropdown.style.display = "none";

      const editBtn: HTMLButtonElement = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.id = String(element.id);
      editBtn.classList.add("edit-btn");

      const deleteBtn: HTMLButtonElement = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.id = String(element.id);
      deleteBtn.classList.add("delete-btn");

      dropdown.appendChild(editBtn);
      dropdown.appendChild(deleteBtn);

      wrapBtnIcon.appendChild(actionButton);
      wrapBtnIcon.appendChild(menuBtn);
      wrapBtnIcon.appendChild(dropdown);
      cell4.appendChild(wrapBtnIcon);

      menuBtn.addEventListener("click", (e: Event) => {
        e.stopPropagation(); // to prevnt Event Bubling

        document
          .querySelectorAll<HTMLDivElement>(".dropdown-menu")
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
  const searchInput = document.querySelector<HTMLInputElement>("#searchInput");
  if (!searchInput) return;

  const searchInputValue = searchInput.value.trim().toLowerCase();

  const searchData: dataSet[] = tData.filter((ele) =>
    String(ele.doctitle).toLowerCase().includes(searchInputValue),
  );

  const tBody = document.querySelector<HTMLTableSectionElement>("tbody");
  if (tBody) tBody.innerHTML = "";

  if (searchInputValue.length === 0) {
    dataRender(tData);
  } else if (searchData.length > 0) {
    dataRender(searchData);
  } 
}



const selectAllCheckbox =
  document.querySelector<HTMLInputElement>("#selectAllCheckbox");

if (selectAllCheckbox) {
  selectAllCheckbox.addEventListener("change", function () {
    const checkBoxes = document.querySelectorAll<HTMLInputElement>(
      'tbody input[type="checkbox"]',
    );

    checkBoxes.forEach((ele) => {
      ele.checked = selectAllCheckbox.checked;
    });
  });
}

// Multi Delete Functionality
let multiDeleteBtn = document.querySelector<HTMLButtonElement>("#multiDelete");

if (multiDeleteBtn) {
  multiDeleteBtn.addEventListener("click", () => {
    // All delets using one main table checkbox

    const selectAllCheckboxValue = selectAllCheckbox?.checked;
    if (selectAllCheckboxValue) {
      const checkBoxes = document.querySelectorAll<HTMLInputElement>(
        'table input[type="checkbox"]',
      );

      if (checkBoxes.length === 1) {
        alert("Add atleast one row");
        return;
      }

      checkBoxes.forEach((cBox) => {
        cBox.checked = true;
      });
    }

    const checkBoxes = document.querySelectorAll<HTMLInputElement>(
      'table input[type="checkbox"]:checked',
    );

    if (checkBoxes.length === 0) {
      alert("Select atleast one row");
      return;
    }

    //  nodeLis
    const checkBoxesIds: Array<string> = Array.from(
      checkBoxes,
      (ele) => ele.id,
    );

    tData = tData.filter((ele) => !checkBoxesIds.includes(String(ele.id)));

    saveData();
    rowInsert();
  });
}

// Edit Functionality
let editRowId: string | null = null;
const tableBody = document.querySelector<HTMLTableSectionElement>(
  ".content-table tbody",
);

if (tableBody) {
  tableBody.addEventListener("click", function (e: Event) {
    const target = e.target;
    if (target instanceof HTMLElement) {
      const editBtn = target.closest(".edit-btn");
      if (editBtn && formBox) {
        editRowId = editBtn.id;
        putDataInForm(editRowId);
        if(input2Div){
        input2Div.style.display = "block";
        }
        formBox.classList.add("active-popup");
      }

      const deleteBtn = target.closest(".delete-btn");
      if (deleteBtn) {
        let deleteBtnId: string = deleteBtn.id;
        tData = tData.filter((ele) => deleteBtnId.includes(String(ele.id)));
        saveData();
        rowInsert();
      }
    }
  });
}

function putDataInForm(btnId: string) {
  tData.forEach((ele) => {
    if (String(ele.id) === btnId) {
      const docTitleInput =
        document.querySelector<HTMLInputElement>("#documentTitle");

      const formStatusInput =
        document.querySelector<HTMLInputElement>("#formStatus");

      if (docTitleInput) {
        docTitleInput.value = ele.doctitle;
      }

      if (formStatusInput) {
        formStatusInput.value = ele.formStatus;
      }

      if (personWaitingInput) {
        personWaitingInput.value = String(ele.personWaiting);
      }
    }
  });
}

function upDateRowData(
  doctitle: string,
  formStatus: string,
  docAddEditDate: number,
  personWaiting: number | null,
) {
  const row = tData.find((ele) => String(ele.id) === String(editRowId));

  // if  row not found
  if (!row) {
    return;
  }

  row.doctitle = doctitle;
  row.formStatus = formStatus;
  row.docAddEditDate = docAddEditDate;
  row.personWaiting = personWaiting;

  saveData();
  const docTitleInput =
    document.querySelector<HTMLInputElement>("#documentTitle");
  const formStatusSelect =
    document.querySelector<HTMLSelectElement>("#formStatus");
  const personWaitingInput =
    document.querySelector<HTMLInputElement>("#personPending");
  const formStatusValue = formReset(
    docTitleInput,
    formStatusSelect,
    personWaitingInput,
  );
  editRowId = null;
}

window.addEventListener("load", () => {
  dataRender(tData);
});
