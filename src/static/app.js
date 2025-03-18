document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});

// Fetch and display activities with participants
async function loadActivities() {
  const response = await fetch('/activities');
  const activities = await response.json();

  const activitiesList = document.getElementById('activities-list');
  const activityTemplate = document.getElementById('activity-template');

  activitiesList.innerHTML = ''; // Clear loading message

  for (const [name, details] of Object.entries(activities)) {
    const activityElement = activityTemplate.content.cloneNode(true);

    activityElement.querySelector('.activity-name').textContent = name;
    activityElement.querySelector('.activity-description').textContent = details.description;
    activityElement.querySelector('.activity-schedule').textContent = details.schedule;

    const participantsList = activityElement.querySelector('.activity-participants');
    if (details.participants.length > 0) {
      details.participants.forEach(participant => {
        const listItem = document.createElement('li');
        listItem.textContent = participant;
        participantsList.appendChild(listItem);
      });
    } else {
      const noParticipants = document.createElement('li');
      noParticipants.textContent = 'No participants yet';
      participantsList.appendChild(noParticipants);
    }

    activitiesList.appendChild(activityElement);
  }
}

// Call loadActivities on page load
document.addEventListener('DOMContentLoaded', loadActivities);
