import { loginUser, sendUser } from "./dataHandler.js";

document.addEventListener("DOMContentLoaded", () => {

    const urlParams = new URLSearchParams(window.location.search);
    const accessParam = urlParams.get("access");
    const formSelection = document.querySelector("#access-selection");

    class AccessForm {
        constructor(accessParam) {
            this.selectionBtns = formSelection.querySelectorAll("a");
            this.forms = document.querySelectorAll("form");
            this.inputs = document.querySelectorAll("input");
            this.selectedForm = accessParam;
            this.handleSelection();
            this.handleInputs();
            this.handleContent();
        }

        handleSelection() {
            this.selectionBtns.forEach((btn) => {
                btn.addEventListener("click", () => {
                    if (btn.id === "login-btn") {
                        this.selectedForm = this.forms[0].id;
                    } else {
                        this.selectedForm = this.forms[1].id;
                    }
                    this.handleContent();
                });
            });
        }

        handleContent() {
            if (this.selectedForm === "login") {
                this.selectionBtns[0].classList.add("selected");
                this.selectionBtns[1].classList.remove("selected");
                this.forms[0].classList.add("active");
                return this.forms[1].classList.remove("active");
            }
            this.selectionBtns[1].classList.add("selected");
            this.selectionBtns[0].classList.remove("selected");
            this.forms[1].classList.add("active");
            this.forms[0].classList.remove("active");
        }

        handleInputs() {
            this.inputs.forEach((input) => {
                if (input.type === "email") {
                    input.addEventListener("keyup", (event) => this.checkEmail(event));
                } else if (input.type === "password") {
                    input.addEventListener("keyup", (event) => this.checkPassword(event));
                } else if (input.type === "text") {
                    input.addEventListener("keyup", (event) => this.checkUsername(event));
                }
            });
        }
        
        checkEmail(event) {
            const email = event.target.value;
            let feedback;
            if (this.selectedForm === "signup") {
                feedback = document.querySelector('#signup-email');
                
            } else {
                feedback = document.querySelector('#login-email');
            }
            if (!email.includes('@')) {
                feedback.style.display = 'block'

            } else {
                feedback.style.display = 'none';
            }
            this.handleForm();
        }

        checkPassword(event) {
            const password = event.target.value;
            const placeholder = event.target.placeholder;

            if (this.selectedForm === "signup") {
                if (placeholder === "Password") {
                    const feedback = document.querySelector('#p-info');
                    const rules = {
                        length: password.length > 8,
                        uppercase: /[A-Z]/.test(password),
                        lowercase: /[a-z]/.test(password),
                        number: /\d/.test(password),
                        specialChar: /[!@#$%^&*(),.?";':{}|<>]/.test(password)
                    };
                    
                    const messages = [];
                    if (!rules.length) messages.push("Password must be longer than 8 characters.");
                    if (!rules.uppercase) messages.push("Password must contain at least one uppercase letter.");
                    if (!rules.lowercase) messages.push("Password must contain at least one lowercase letter.");
                    if (!rules.number) messages.push("Password must contain at least one number.");
                    if (!rules.specialChar) messages.push("Password must contain at least one special character.");
                    if (messages.length === 0) {
                        feedback.style.display = 'none';
                        const confirmPw = document.querySelector('#confirm-pw').value;
                        if (confirmPw.length > 0) {
                            const confirmFeedback = document.querySelector('#cp-info');
                            if (password !== confirmPw) {
                                confirmFeedback.style.display = 'block'
                
                            } else {
                                confirmFeedback.style.display = 'none';
                            }
                        }
                    } else {
                        feedback.style.display = 'block';
                        feedback.innerHTML = messages.join('<br>');
                    }
                    return;     
                }
                const feedback = document.querySelector('#cp-info');
                const realPw = document.querySelector('#signup-pw').value;
                if (password !== realPw) {
                    feedback.style.display = 'block'

                } else {
                    feedback.style.display = 'none';
                }
            }
            this.handleForm();
        }

        checkUsername(event) {
            const username = event.target.value;
            const feedback = document.querySelector('#username-feedback');

            if (/^[a-zA-Z0-9]+$/.test(username)) {
                feedback.style.display = 'none';
            } else {
                feedback.style.display = 'block';
            }
            this.handleForm();
        }

        handleForm() {
            const form = document.querySelector(`#${this.selectedForm}`);
            let submitButton;

            const formInputs = form.querySelectorAll("input");
            let inputsChecked = true;

            const formFeedbacks = form.querySelectorAll("div");
            let feedbacksChecked = true;

            formInputs.forEach((input) => {
                if (!input.value) {
                    inputsChecked = false;
                }
                if (input.type === "submit") {
                    submitButton = input;
                }
            });

            formFeedbacks.forEach((feedback) => {
                if (feedback.style.display !== "none") {
                    feedbacksChecked = false;
                }
            });

            if (feedbacksChecked === true && inputsChecked === true) {
                return submitButton.disabled = false;
            } 
            submitButton.disabled = true;
        }

    }

    new AccessForm(accessParam);

    const signupform = document.getElementById('signup');

    signupform.addEventListener('submit', async function(event) {
        event.preventDefault();  

        const email = signupform.querySelector('[name="email"]').value;
        const username = signupform.querySelector('[name="username"]').value;
        const password = signupform.querySelector('[name="password"]').value;

        await sendUser(email, username, password);
    });

    const loginform = document.getElementById('login');

    loginform.addEventListener('submit', async function(event) {
        event.preventDefault();  

        const email = loginform.querySelector('[name="email"]').value;
        const password = loginform.querySelector('[name="password"]').value;

        await loginUser(email, password);
    })
});