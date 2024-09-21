const fields = document.getElementById("fields");

const bill = document.getElementById("bill-amount");

const tipPercents = document.getElementsByName("tip-percent");
const customTip = document.getElementById("custom");

const people = document.getElementById("people-amount");

const tipDisplay = document.getElementById("result__tip");
const totalDisplay = document.getElementById("result__total");

const resetBtn = document.getElementById("btn-reset");

// if all fields are filled in correctly,
// display result and enable reset button
fields.addEventListener("input", (e) => {
    e.preventDefault();

    if (
        bill.value &&
        (isTipPercentFilledIn() || customTip.value) &&
        people.value &&
        !isErrorDetected()
    ) {
        checkIfTipIsCustom();
    } else {
        resetDisplay();

        resetBtn.disabled = true;
    }
});

// START OF BILL ###############

// live format currency value
// template: '0.00'
bill.addEventListener("keydown", (e) => {
    const value = e.target.value;
    const formattedValue = formatCurrency(e, value);
    e.target.value = formattedValue;
});

// check for errors
bill.addEventListener("change", (e) => {
    if (e.currentTarget.value == 0) {
        errorIsZero(e);
    } else {
        clearError(e.currentTarget);
    }
});

// END OF BILL ###############

// START OF TIP ###############

// reset errors if radio is selected
tipPercents.forEach(percent => {
    percent.addEventListener("change", () => {
        customTip.value = null;
        clearError(customTip);
    });
});

// unselect all radio buttons when custom tip is focused
customTip.addEventListener("focus", () => {
    tipPercents.forEach(percent => {
        percent.checked = false;
    });
});

// check for errors in custom percentage
customTip.addEventListener("change", (e) => {
    if (e.currentTarget.value == 0) {
        errorIsZero(e);
    } else if (e.currentTarget.value < 0) {
        errorIsNegative(e);
    } else {
        clearError(e.currentTarget);
    }
});

// END OF TIP ###############

// START OF PEOPLE ###############

// check for errors
people.addEventListener("change", (e) => {
    if (e.currentTarget.value == 0) {
        errorIsZero(e);
    } else if (e.currentTarget.value < 0) {
        errorIsNegative(e);
    } else if (e.currentTarget.value % 1 !== 0) {
        errorIsFraction(e);
    } else {
        clearError(e.currentTarget);
    }
});

// END OF PEOPLE ###############

resetBtn.addEventListener("click", (e) => {
    resetDisplay();

    fields.reset();
    e.currentTarget.disabled = true;
});

// START OF ERROR HANDLING ###############

function isErrorDetected() {
    if (
        bill.value <= 0 ||
        (customTip.value <= 0 && !isTipPercentFilledIn()) ||
        people.value <= 0 ||
        people.value % 1 !== 0
    ) {
        return true;
    }

    return false;
}

function errorIsZero(e) {
    showError(e.currentTarget, e.currentTarget.labels[0], "Can't be zero!");
}

function errorIsNegative(e) {
    showError(e.currentTarget, e.currentTarget.labels[0], "Can't be negative!");
}

function errorIsFraction(e) {
    showError(e.currentTarget, e.currentTarget.labels[0], "Must be an integer!");
}

function showError(targetField, target, error) {
    target.textContent = error;

    targetField.classList.add("error-outline");
}

function clearError(target) {
    target.labels[0].textContent = "";
    target.classList.remove("error-outline");
}

// END OF ERROR HANDLING ###############

function resetDisplay() {
    tipDisplay.textContent = "0.00";
    totalDisplay.textContent = "0.00";
}

function formatCurrency(e, value) {
    switch (e.key) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            if (!value) {
                return `0.0${value}`
            } else {
                const parts = value.toString().split(".");
                const decimals = parts[1].toString().split("");

                parts[0] += decimals[0];

                if (/^0/.test(parts[0])) {
                    parts[0] = parts[0].slice(1);
                }

                decimals.shift();
                parts[1] = decimals.join("");

                return parts.join(".");
            }
        case "Backspace":
            const parts = value.toString().split(".");
            const units = parts[0].toString().split("");

            parts[1] = units[units.length - 1] + parts[1];
            units.pop();

            if (units.length === 0) {
                units[0] = "0";
            }

            parts[0] = units.join("");

            return parts.join(".");
    }

}

function isTipPercentFilledIn() {
    let checked = false;

    tipPercents.forEach(percent => {
        if (percent.checked) {
            checked = true;
        }
    });
    return checked;
}

function checkIfTipIsCustom() {
    if (isTipPercentFilledIn()) {
        const tip = Number(document.querySelector('.tip__radio:checked').id);

        tipDisplay.textContent = calculateTip(bill.value, tip, people.value);
        totalDisplay.textContent = calculateTotal(bill.value, tip, people.value);
    } else {
        tipDisplay.textContent = calculateTip(bill.value, customTip.value, people.value);
        totalDisplay.textContent = calculateTotal(bill.value, customTip.value, people.value);
    }

    resetBtn.disabled = false;
}

function calculateTip(bill, tip, people) {
    const result = Math.trunc((tip * bill)) * 0.01 / people;
    return parseFloat(result).toFixed(2);
}

function calculateTotal(bill, tip, people) {
    const result = (Number(bill) + Math.trunc((tip * bill)) * 0.01) / people;
    return parseFloat(result).toFixed(2);
}