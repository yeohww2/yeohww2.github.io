// Button to return to the portfolio
function returnToPortfolio() {
    window.location.href = 'https://yeohww2.github.io/#projects';
}
document.getElementById('close-button').addEventListener('click', returnToPortfolio);

// BMI Categories
const BMI_CATEGORIES = {
    Underweight: "Underweight",
    Healthy: "Healthy",
    Overweight: "Overweight",
    Obese: "Obese",
};

// Calculate BMI
function calculateBMI(weight, height) {
    const bmi = weight / (height * height);
    return {
        value: bmi.toFixed(2),
        category: categorizeBMI(bmi),
    };
}

// Categorize BMI
function categorizeBMI(bmi) {
    if (bmi < 18.5) return BMI_CATEGORIES.Underweight;
    if (bmi < 25) return BMI_CATEGORIES.Healthy;
    if (bmi < 30) return BMI_CATEGORIES.Overweight;
    return BMI_CATEGORIES.Obese;
}

function limitDecimals(element, decimals) {
    // Allow only valid numbers and restrict to two decimal places
    const value = element.value;
    if (value.includes(".")) {
        const parts = value.split(".");
        if (parts[1].length > decimals) {
            element.value = parseFloat(value).toFixed(decimals);
        }
    }
}

// Validate Input and Display Errors
function validateInput() {
    let isValid = true;

    // Name Validation
    const name = document.getElementById('name').value.trim();
    const nameError = document.getElementById('name-error');
    if (!name || !/^[a-zA-Z]+( [a-zA-Z]+)*$/.test(name)) {
        nameError.innerText = "Name must only contain letters and can have multiple words.";
        isValid = false;
    } else {
        nameError.innerText = "";
    }

    // Height Validation
    const height = parseFloat(document.getElementById('height').value);
    const heightError = document.getElementById('height-error');
    if (isNaN(height) || height < 0.5 || height > 2.5 || !/^\d+(\.\d{1,2})?$/.test(height)) {
        heightError.innerText = "Height must be a valid number between 0.5m and 2.5m with up to 2 decimal places.";
        isValid = false;
    } else {
        heightError.innerText = "";
    }

// Weight Validation
    const weight = parseFloat(document.getElementById('weight').value);
    const weightError = document.getElementById('weight-error');
    if (isNaN(weight) || weight < 10 || weight > 300 || !/^\d+(\.\d{1,2})?$/.test(weight)) {
        weightError.innerText = "Weight must be a valid number between 10kg and 300kg with up to 2 decimal places.";
        isValid = false;
    } else {
        weightError.innerText = "";
    }

    console.log("Validation - Name:", name, "Height:", height, "Weight:", weight);
    return isValid ? { name, height, weight } : null;
}

// Display BMI Information
function displayBMIInfo(name, bmiResult) {
    console.log("BMI Result:", bmiResult);
    document.getElementById('bmi-result').innerText = `BMI Value: ${bmiResult.value}`;
    document.getElementById('bmi-advice').innerText = generateAdvice(name, bmiResult.category);
    document.getElementById('result-container').style.display = "block";
}

function generateAdvice(name, category) {
    const advice = {
        [BMI_CATEGORIES.Underweight]: `${name}, you are underweight. Consider consulting a dietitian for advice.`,
        [BMI_CATEGORIES.Healthy]: `${name}, you have a healthy BMI. Keep maintaining a balanced diet.`,
        [BMI_CATEGORIES.Overweight]: `${name}, you are slightly overweight. Regular exercise is recommended.`,
        [BMI_CATEGORIES.Obese]: `${name}, you are in the obese category. Consult with your doctor for advice.`,
    };
    return advice[category];
}

// Start BMI Calculation
document.getElementById('calculate-button').addEventListener('click', () => {
    console.log("Calculate button clicked");
    const input = validateInput();
    if (!input) return;

    const { name, height, weight } = input;
    const bmiResult = calculateBMI(weight, height);
    displayBMIInfo(name, bmiResult);
});

// Falling Leaf Animation
for (let i = 1; i <= 10; i++) {
    const leaf = document.createElement("div");
    leaf.classList.add("leaf");
    leaf.style.setProperty("--i", i);
    document.body.appendChild(leaf);
}

