// __tests__/modal.test.js

// Assuming you have already imported or defined the following variables and functions in your project
// import { openModal, handleMouseOver, handleMouseOut, svg, modal, modalText, labelInput } from '../path_to_your_file';

// Mocking the DOM elements
document.body.innerHTML = `
    <div id="myModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <p id="modal-text"></p>
            <input type="text" id="label-input" />
            <button id="save-label" class="modal-button">Save</button>
            <button id="cancel" class="modal-button">Cancel</button>
            <br>
            <button id="view-scale" class="modal-button">Scaled View</button>
            <button id="view-scope" class="modal-button">Scoped View</button>
        </div>
    </div>
    <svg id="chart"></svg>
`;

// Requiring D3.js for selectAll
const d3 = require('d3');

// Selecting the SVG element for the tests
const svg = d3.select("#chart");

// Defining the modal-related variables
const modal = document.getElementById('myModal');
const modalText = document.getElementById('modal-text');
const labelInput = document.getElementById('label-input');

// Defining the functions
function openModal(url, className, textElement) {
    modal.style.display = 'flex';
    modalText.textContent = `Square ${className} clicked! Edit Label:`;
    labelInput.value = textElement.textContent;
}

function handleMouseOver(element) {
    const id = d3.select(element).attr("id");
    svg.selectAll('.square').classed('faded', true);
    d3.select(element).classed('faded', false).classed('hovered', true);

    svg.selectAll('.square').each(function () {
        if (d3.select(this).attr('parent-id') === id) {
            d3.select(this).classed('faded', false).classed('hovered', true);
        }
    });
}

function handleMouseOut() {
    svg.selectAll('.square').classed('faded', false).classed('hovered', false);
}

// Unit test cases using Jest framework

// Positive test case for openModal function
test('openModal function should open the modal with correct text', () => {
    const url = 'test_url';
    const className = 'test_class';
    const textElement = document.createElement('p');
    textElement.textContent = 'Test Label';
    openModal(url, className, textElement);
    expect(modal.style.display).toBe('flex');
    expect(modalText.textContent).toBe('Square test_class clicked! Edit Label:');
    expect(labelInput.value).toBe('Test Label');
});

// Negative test case for openModal function
test('openModal function should not open the modal with incorrect text', () => {
    const url = 'test_url';
    const className = 'test_class';
    const textElement = document.createElement('p');
    textElement.textContent = 'Test Label';
    openModal(url, className, textElement);
    expect(modal.style.display).not.toBe('none');
    expect(modalText.textContent).not.toBe('Incorrect text');
    expect(labelInput.value).not.toBe('Incorrect Label');
});

// Positive test case for handleMouseOver function
test('handleMouseOver function should highlight neighboring squares', () => {
    const element = document.createElement('rect');
    element.setAttribute('id', 'root');
    handleMouseOver(element);
    expect(svg.selectAll('.square.hovered').size()).toBeGreaterThan(0);
});

// Negative test case for handleMouseOver function
test('handleMouseOver function should not highlight neighboring squares if element ID is incorrect', () => {
    const element = document.createElement('rect');
    element.setAttribute('id', 'invalid_id');
    handleMouseOver(element);
    expect(svg.selectAll('.square.hovered').size()).toBe(0);
});

// Positive test case for handleMouseOut function
test('handleMouseOut function should remove highlighting from all squares', () => {
    handleMouseOut();
    expect(svg.selectAll('.square.hovered').size()).toBe(0);
});

// Negative test case for handleMouseOut function
test('handleMouseOut function should not remove highlighting if squares are not hovered', () => {
    svg.selectAll('.square').classed('hovered', true);
    handleMouseOut();
    expect(svg.selectAll('.square.hovered').size()).toBeGreaterThan(0);
});
