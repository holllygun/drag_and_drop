/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/js/tables.js
class Tables {
  constructor() {
    this.addTask();
    this.initDragAndDrop();
  }
  createTaskElement(value) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");
    wrapper.setAttribute("draggable", "true");
    wrapper.innerHTML = `
            <div class="task">${value}</div>
            <button class="delete_btn">⨉</button>
        `;
    return wrapper;
  }
  deleteTask() {
    document.querySelector(".planner_container").addEventListener("click", event => {
      const deleteBtn = event.target.closest(".delete_btn");
      if (deleteBtn) {
        const wrapper = deleteBtn.closest(".wrapper");
        if (wrapper) {
          wrapper.remove();
        }
      }
    });
  }
  newTask(input, btn, popupBtn) {
    if (!input) return;
    const value = input.value.trim();
    if (!value) {
      input.placeholder = "Please, write down a task!";
    } else {
      const taskContainer = btn.closest(".task_container");
      taskContainer.insertAdjacentHTML("afterbegin", `<div class="wrapper"><div class="task">${value}</div><button class="delete_btn">⨉</button></div>`);
      input.remove();
      btn.classList.remove("hidden");
      popupBtn.classList.add("hidden");
    }
  }
  addTask() {
    const addBtns = document.querySelectorAll(".add_another_card");
    addBtns.forEach(btn => {
      const popupBtn = btn.nextElementSibling;
      btn.addEventListener("click", () => {
        btn.classList.add("hidden");
        console.log("click");
        popupBtn.classList.remove("hidden");
        btn.insertAdjacentHTML("beforebegin", `<input class="add_task" placeholder='Enter a title for this card'/>`);
        const input = btn.previousElementSibling;
        if (input) {
          input.addEventListener("keydown", e => {
            if (e.key === "Enter") {
              this.newTask(input, btn, popupBtn);
            }
          });
        }
      });
      popupBtn.addEventListener("click", () => {
        const input = btn.previousElementSibling;
        this.newTask(input, btn, popupBtn);
      });
    });
  }
  initDragAndDrop() {
    const taskContainers = document.querySelectorAll(".task_container");
    let draggedEl = null;
    document.addEventListener("dragstart", e => {
      if (e.target.classList.contains("wrapper")) {
        draggedEl = e.target;
        draggedEl.classList.add("dragging");
      }
    });
    document.addEventListener("dragend", e => {
      if (draggedEl) {
        draggedEl.classList.remove("dragging");
        draggedEl = null;
      }
    });
    taskContainers.forEach(container => {
      container.addEventListener("dragover", e => {
        e.preventDefault();
        const afterElement = this.getDragAfterElement(container, e.clientY);
        const draggingElement = document.querySelector(".dragging");
        if (draggingElement) {
          if (afterElement == null) {
            const addAnotherCardBtn = container.querySelector(".add_another_card");
            container.insertBefore(draggingElement, addAnotherCardBtn);
          } else {
            container.insertBefore(draggingElement, afterElement);
          }
        }
      });
      container.addEventListener("drop", e => {
        e.preventDefault();
      });
    });
  }
  getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".wrapper:not(.dragging)")];
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return {
          offset: offset,
          element: child
        };
      } else {
        return closest;
      }
    }, {
      offset: Number.NEGATIVE_INFINITY
    }).element;
  }
}
;// ./src/js/app.js

const table = new Tables();
const planner = document.querySelector(".planner_container");
table.deleteTask();
window.addEventListener("beforeunload", () => {
  const tableData = {};
  const tasks = [];
  planner.querySelectorAll(".task").forEach(task => {
    tasks.push({
      containerId: task.closest(".task_container").id,
      value: task.textContent
    });
  });
  tableData.tasks = tasks;
  localStorage.setItem("tableData", JSON.stringify(tableData));
});
document.addEventListener("DOMContentLoaded", () => {
  const json = localStorage.getItem("tableData");
  if (!json) return;
  let tableData;
  try {
    tableData = JSON.parse(json);
  } catch (error) {
    console.log(error);
  }
  if (tableData.tasks) {
    tableData.tasks.forEach(task => {
      const container = planner.querySelector(`#${task.containerId}`);
      if (container) {
        const wrapper = document.createElement("div");
        wrapper.draggable = "true";
        wrapper.classList.add("wrapper");
        wrapper.innerHTML = `<div class="task">${task.value}</div><button class="delete_btn">⨉</button>`;
        const addButton = container.querySelector(".add_another_card");
        container.insertBefore(wrapper, addButton);
      }
    });
  }
});
;// ./src/index.js


/******/ })()
;