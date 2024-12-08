// Wait for the DOM to fully load before executing any JavaScript
document.addEventListener("DOMContentLoaded", () => {
    // Get references to the form and the task board where tasks will be displayed
    const taskForm = document.getElementById("taskForm");
    const taskBoard = document.getElementById("taskBoard");
  
    // Function to load tasks from localStorage and display them on the task board
    const loadTasks = () => {
        // Retrieve tasks from localStorage; if none exist, initialize an empty array
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        // Loop through each task and display it if it hasn't expired
        tasks.forEach((task) => {
            if (!isTaskExpired(task.date, task.time)) {
                addTaskToBoard(task);
            }
        });
    };
  
    // Function to save tasks currently displayed on the task board into localStorage
    const saveTasks = () => {
        const tasks = []; // Initialize an empty array to store task data
        // Select all task cards on the board
        document.querySelectorAll('.task-card').forEach(taskCard => {
            // Extract task details from the task card's content
            const description = taskCard.querySelector('.task-content').innerHTML;
            const date = taskCard.querySelector('.due-date div:nth-child(1)').innerText.replace('Date: ', '');
            const time = taskCard.querySelector('.due-date div:nth-child(2)').innerText.replace('Time: ', '');
            // Add the task details to the tasks array
            tasks.push({ description, date, time });
        });
        // Store the tasks array as a JSON string in localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };
  
    // Function to check if a task's due date and time have already passed
    const isTaskExpired = (date, time) => {
        const taskDateTime = new Date(`${date}T${time}`); // Create a Date object from the task's date and time
        const now = new Date(); // Get the current date and time
        return taskDateTime < now; // Return true if the task's time has passed
    };
  
    // Function to add a task to the task board
    const addTaskToBoard = ({ description, date, time }) => {
        if (isTaskExpired(date, time)) return;

        const taskCard = document.createElement("div");
        taskCard.className = "task-card col-auto";
        taskCard.style.backgroundImage = "url('assets/images/notebg.png')";
        taskCard.style.backgroundSize = "contain";
        taskCard.style.backgroundRepeat = "no-repeat";
        taskCard.style.width = "200px";
        taskCard.style.height = "250px";
        taskCard.style.position = "relative";
        taskCard.style.padding = "20px";
        taskCard.style.boxSizing = "border-box";

        taskCard.innerHTML = `
            <div class="task-content" style="overflow-y: auto; max-height: 150px;">
                ${description}
            </div>
            <div class="due-date" style="position: absolute; bottom: 10px; left: 10px; font-size: 0.9rem; color: #666; text-align: left;">
                <div>Date: ${date}</div>
                <div>Time: ${time}</div>
            </div>
            <button class="btn btn-danger btn-sm delete-btn" style="position: absolute; top: 10px; right: 10px;">X</button>
        `;

        taskCard.querySelector(".delete-btn").addEventListener("click", () => {
            taskCard.classList.add("fade-out");
            setTimeout(() => {
                taskCard.remove();
                saveTasks();
            }, 500); // Match the duration of the CSS transition
        });

        taskBoard.appendChild(taskCard);
        setTimeout(() => taskCard.classList.add("fade-in"), 10); // Slight delay to trigger the transition
        saveTasks();
    };
  
    // Add an event listener to handle form submission
    taskForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent the form's default submission behavior

        // Get task details from the form inputs
        const description = taskForm.taskDescription.value.trim();
        const date = taskForm.taskDate.value;
        const time = taskForm.taskTime.value;

        // Validate that all fields have been filled out before adding the task
        if (description && date && time) {
            addTaskToBoard({ description, date, time }); // Add the task to the board
            taskForm.reset(); // Clear the form inputs for the next task
        }
    });

    // Load existing tasks from localStorage when the page loads
    loadTasks();
});
