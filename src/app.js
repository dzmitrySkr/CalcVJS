import "../src/app.css";
import _ from "./utils";

class Calculator {

    static ZERO= "0";
    static EMPTY_STRING = "";
    static ERROR_MESSAGE = "ERROR";

    #currentInput = Calculator.ZERO;
    #accumulator= null;
    #pendingOp= null;
    #error= null;
    #awaitingNewInput = false;


    constructor() {

    }

    setCurrentInput(currentInput = Calculator.EMPTY_STRING) {
        this.#currentInput = currentInput;
        return this;
    }
    getCurrentInput() {
        return this.#currentInput;
    }

    setAccumulator(accumulator) {
        this.#accumulator = accumulator;
        return this;
    }

    getAccumulator() {
        return this.#accumulator;
    }

    setPendingOp(pendingOp) {
        this.#pendingOp = pendingOp;
    }

    getPendingOp() {
        return this.#pendingOp;
    }

    setError(error) {
        this.#error = error;
        return this;
    }
    getError(){
        return this.#error;
    }

    resetAll() {
        this.#currentInput = Calculator.ZERO;
        this.#accumulator = null;
        this.#pendingOp = null;
        this.#error = null;
    }

    formatInputForDisplay() {
        let input = this.getCurrentInput();
        if (input === Calculator.EMPTY_STRING) return Calculator.ZERO;

        if (input.includes(".")) {
            let [intPart, frac] = input.split(".");
            while (intPart.length > 1 && intPart[0] === Calculator.ZERO) {
                intPart = intPart.slice(1);
            }
            if (intPart === Calculator.EMPTY_STRING) intPart = Calculator.ZERO;
            return intPart + "." + frac;
        } else {
            while (input.length > 1 && input[0] === Calculator.ZERO) {
                input = input.slice(1);
            }
            if (input === Calculator.EMPTY_STRING) input = Calculator.ZERO;
            return input;
        }
    }

    inputNumber(number) {
        if (this.#error) return;
        this.checkToClearInput();
        if (number === ".") {
            if (this.#currentInput.includes(".")) return;
            this.#currentInput += ".";
            return;
        }
        if (this.#currentInput === Calculator.ZERO) this.#currentInput = String(number);
        else this.#currentInput += String(number);
    }

    checkToClearInput(){
        if(this.#awaitingNewInput){
            this.setCurrentInput();
            this.#awaitingNewInput = false;
        }
    }

    toggleSign() {
        if (this.#error) return;
        if (this.#currentInput === Calculator.ZERO) return;
        if (this.#currentInput.startsWith("-")) this.#currentInput = this.#currentInput.slice(1);
        else this.#currentInput = "-" + this.#currentInput;
    }

    percent() {
        if (this.#error) return;
        const num = this.toNumber(this.#currentInput);
        const res = num / 100;
        this.setCurrentInput(this.numberToString(res));
    }

    setOperator(operator) {
        if (this.#error) return;
        if (_.notNull(this.#pendingOp) ) {
            this.compute();
        } else {
            this.#accumulator = this.toNumber(this.#currentInput);
        }
        this.#pendingOp = operator;
        this.#awaitingNewInput = true;
    }

    compute() {
        if (this.#error || this.#awaitingNewInput) return;
        const a = (_.isNull(this.#accumulator)) ? 0 : this.#accumulator;
        const b = this.toNumber(this.#currentInput);
        let res;
        switch (this.#pendingOp) {
            case "+":
                res = a + b;
                break;
            case "-":
                res = a - b;
                break;
            case "*":
                res = a * b;
                break;
            case "/":
                if (b === 0) {
                    this.resetAll();
                    this.#error = Calculator.ERROR_MESSAGE;
                    return;
                } else {
                    res = a / b;
                }
                break;
            default:
                res = b;
        }

        this.#accumulator = res;
        this.#pendingOp = null;
        this.#currentInput = this.numberToString(res);
    }

    numberToString(number) {
        if (!isFinite(number) || number === 0) return Calculator.ZERO;
        let stringNumber = number.toString();
        if (stringNumber.includes("e")) return stringNumber;
        let fixed = Number(number).toFixed(10);
        return parseFloat(fixed).toString();
    }

    toNumber(string) {
        if (_.emptyOrNull(string)) return 0;
        const num = Number(string);
        if (!isFinite(num)) return 0;
        return num;
    }

    getDisplayValue() {
        if (this.#error) return this.#error;
        return this.formatInputForDisplay();
    }

    getHistory() {
        if (this.#error) return Calculator.EMPTY_STRING;
        if (this.#pendingOp && _.notNull(this.#accumulator)) {
            return `${this.numberToString(this.#accumulator)} ${this.#pendingOp}`;
        }
        return Calculator.EMPTY_STRING;
    }
}


class CalculatorUI {

    static NUMBERS = ["0","1","2","3","4","5","6","7","8","9"];
    static OPERATORS = ["+","-","*","/"];
    static CLEAR = "clear";
    static EQUALS = "equals";
    static LIGHT = "light";
    static DARK = "dark";
    static THEME = "theme";

    constructor() {
        this.calc = new Calculator();
        this.valueEl = _.getById("value");
        this.historyEl = _.getById("history");
        this.buttons = _.getById("buttons");
        this.initTheme();
        this.init();
        this.renderUI();
    }

    initTheme(){
        const calculator = _.getById("calculator");
        const toggle = _.getById("toggle");

        toggle.addEventListener("change", (e) => {
            if(e.target.checked){
                calculator.dataset.theme = CalculatorUI.DARK;
                localStorage.setItem(CalculatorUI.THEME, CalculatorUI.DARK);
            } else {
                calculator.dataset.theme = CalculatorUI.LIGHT;
                localStorage.setItem(CalculatorUI.THEME, CalculatorUI.LIGHT);
            }
        });

        const savedTheme = localStorage.getItem(CalculatorUI.THEME) || CalculatorUI.LIGHT;
        toggle.checked = savedTheme === CalculatorUI.DARK;
        toggle.dispatchEvent(new Event("change"));
    }

    init() {
        this.initMouseClick();
        this.initKeyboardClick();
    }

    initMouseClick(){
        this.buttons.addEventListener("click", (event) => {
            const btn = event.target.closest("button");
            if (!btn) return;
            if (btn.dataset.number) {
                this.onNumber(btn.dataset.number);
            } else if (btn.dataset.operators) {
                this.onOperator(btn.dataset.operators);
            } else if (btn.dataset.action) {
                this.onAction(btn.dataset.action);
            }
        });
    }

    initKeyboardClick(){
        window.addEventListener("keydown", (e) => {
            const key = e.key.toLowerCase();
            if (CalculatorUI.NUMBERS.includes(key)) {
                this.onNumber(key);
            } else if (key === "." || key === ",") {
                this.onNumber(".");
            } else if (CalculatorUI.OPERATORS.includes(key)) {
                this.onOperator(key);
            } else if (key === "enter" || key === "=") {
                this.onAction(CalculatorUI.EQUALS);
            } else if (key === "backspace") {
                this.backspace();
            } else if (key === "c") {
                this.onAction(CalculatorUI.CLEAR);
            }

            if (CalculatorUI.NUMBERS.concat(CalculatorUI.OPERATORS, [".","enter","="]).includes(key)) e.preventDefault();
        });
    }

    onNumber(number) {
        this.calc.inputNumber(number);
        this.renderUI();
    }

    onOperator(operator) {
        this.calc.setOperator(operator);
        this.renderUI();
    }

    onAction(action) {
        switch(action) {
            case CalculatorUI.CLEAR: this.calc.resetAll(); break;
            case "sign": this.calc.toggleSign(); break;
            case "percent": this.calc.percent(); break;
            case CalculatorUI.EQUALS: this.calc.compute(); break;
        }
        this.renderUI();
    }

    backspace() {
        if (this.calc.getError()) {
            this.calc.resetAll();
            this.renderUI();
            return;
        }
        let currInput = this.calc.getCurrentInput();
        currInput.length <= 1
            ?this.calc.setCurrentInput(Calculator.ZERO)
            :this.calc.setCurrentInput(currInput.slice(0, -1));
        this.renderUI();
    }

    renderUI() {
        this.valueEl.textContent = this.calc.getDisplayValue();
        this.historyEl.textContent = this.calc.getHistory();
    }
}

document.addEventListener("DOMContentLoaded", () => new CalculatorUI());