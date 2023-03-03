/**	CONTACT FORM
*************************************************** **/

// Get a reference to the form element
const submitForm = document.getElementById('contact-form');
const submit = document.getElementById('submit');

// Add an event listener for when the form is submitted
submitForm.addEventListener("submit", myFunction);

// Function to handle form submission
function myFunction(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  console.log("myFunction called");

  // Get the form data
  const myFormData = {
    full_name: document.getElementById("full_name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    company_name: document.getElementById("company_name").value,
    project_name: document.getElementById("project_name").value,
    project_desc: document.getElementById("project_desc").value,
    department: document.getElementById("department").value,
    message: document.getElementById("message").value,
    file: document.getElementById("file").value
  };
  console.log(myFormData)

  // Send the form data to the server
  fetch('http://localhost:3004/message-us', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(myFormData)
  })
  .then(res => res.json())
  .then(data => {
    console.log("Success:", data);

    // Update the HTML elements with the received data
    document.getElementById("full_name_modal").innerHTML = data.full_name;
    document.getElementById("email_modal").innerHTML = data.email;
    document.getElementById("phone_modal").innerHTML = data.phone;
    document.getElementById("company_name_modal").innerHTML = data.company_name;
    document.getElementById("project_name_modal").innerHTML = data.project_name;
    document.getElementById("project_desc_modal").innerHTML = data.project_desc;
    document.getElementById("department_modal").innerHTML = data.department;
    document.getElementById("message_modal").innerHTML = data.message;
    document.getElementById("file_modal").innerHTML = data.file;
  })
  .catch(error => console.error("Error:", error));
}
