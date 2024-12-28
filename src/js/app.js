import Tables from "./tables";
const table = new Tables();
const planner = document.querySelector(".planner_container");
table.deleteTask();

window.addEventListener("beforeunload", () => {
  const tableData = {};

  const tasks = [];
  planner.querySelectorAll(".task").forEach((task) => {
    tasks.push({
      containerId: task.closest(".task_container").id,
      value: task.textContent,
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
    tableData.tasks.forEach((task) => {
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
