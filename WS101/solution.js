// solution.js
// Laboratory 4: JavaScript Fundamentals & Git Concepts

// Problem 1: The Strict Type Checker
function checkVariable(input) {
    // Use typeof to get the type as a string
    const type = typeof input;
    
    switch (type) {
        case 'string':
            return 'string';
        case 'number':
            return 'number';
        case 'boolean':
            return 'boolean';
        case 'bigint':
            return 'bigint';
        case 'undefined':
            return 'undefined';
        default:
            // For object and null (typeof null returns 'object')
            return 'object';
    }
}

// Test Problem 1
console.log('=== Problem 1: Type Checker ===');
console.log(checkVariable('hello'));      // string
console.log(checkVariable(42));            // number
console.log(checkVariable(true));          // boolean
console.log(checkVariable(123n));          // bigint
console.log(checkVariable(undefined));     // undefined
console.log(checkVariable({}));            // object
console.log(checkVariable(null));          // object


// Problem 2: Secure ID Generator
function generateIDs(count) {
    const ids = [];
    
    for (let i = 0; i < count; i++) {
        // Skip the number 5 using continue
        if (i === 5) {
            continue;
        }
        ids.push(`ID-${i}`);
    }
    
    return ids;
}

// Test Problem 2
console.log('\n=== Problem 2: Secure ID Generator ===');
console.log(generateIDs(7));  // ["ID-0", "ID-1", "ID-2", "ID-3", "ID-4", "ID-6"]
console.log(generateIDs(10)); // IDs 0-9 except 5


// Problem 3: The Functional Sum
function calculateTotal(...numbers) {
    // Check if all arguments are numbers
    for (let i = 0; i < numbers.length; i++) {
        if (typeof numbers[i] !== 'number') {
            throw new TypeError('Invalid input: All arguments must be numbers');
        }
    }
    
    // Use reduce to sum all numbers
    return numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

// Test Problem 3
console.log('\n=== Problem 3: The Functional Sum ===');
try {
    console.log(calculateTotal(1, 2, 3, 4, 5));      // 15
    console.log(calculateTotal(10, 20, 30));         // 60
    // This will throw an error
    console.log(calculateTotal(1, 2, '3', 4));
} catch (error) {
    console.error('Error:', error.message);  // "Invalid input: All arguments must be numbers"
}


// Problem 4: Leaderboard Filter
function getTopScorers(playerList) {
    // Expand to 10 players (ensure we have enough for testing)
    const expandedList = [
        ...playerList,
        { name: 'Charlie', score: 9 },
        { name: 'David', score: 7 },
        { name: 'Eve', score: 10 },
        { name: 'Frank', score: 6 },
        { name: 'Grace', score: 8 },
        { name: 'Henry', score: 9 },
        { name: 'Ivy', score: 4 },
        { name: 'Jack', score: 10 }
    ];
    
    // Filter players with score > 8, map to names, then join
    return expandedList
        .filter(player => player.score > 8)
        .map(player => player.name)
        .join(', ');
}

// Test Problem 4
console.log('\n=== Problem 4: Leaderboard Filter ===');
const players = [
    { name: 'Alice', score: 10 },
    { name: 'Bob', score: 5 }
];
console.log(getTopScorers(players));  // Should return names with scores > 8


// Problem 5: The Private Inventory
class Item {
    // Private property (indicated by #)
    #discount = 0.1;  // 10% discount
    
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
    
    // Getter for final price after discount
    get finalPrice() {
        return this.price - (this.price * this.#discount);
    }
    
    // Optional: Getter to access discount (for testing)
    get discount() {
        return this.#discount;
    }
}

// Test Problem 5
console.log('\n=== Problem 5: The Private Inventory ===');
const laptop = new Item('Gaming Laptop', 50000);
console.log(laptop.name);               // "Gaming Laptop"
console.log(laptop.price);               // 50000
console.log(laptop.finalPrice);          // 45000 (with 10% discount)
// console.log(laptop.#discount);        // SyntaxError - private property

const phone = new Item('Smartphone', 20000);
console.log(`${phone.name}: ₱${phone.price} -> ₱${phone.finalPrice}`);


// Problem 6: Robust Division
function safeDivide(a, b) {
    try {
        // Check if denominator is zero
        if (b === 0) {
            throw new Error('Cannot divide by zero');
        }
        
        // Perform division
        return a / b;
    } catch (error) {
        // Return the error message string
        return error.message;
    } finally {
        // Always log this message
        console.log('Operation attempted');
    }
}

// Test Problem 6
console.log('\n=== Problem 6: Robust Division ===');
console.log(safeDivide(10, 2));   // 5, then logs "Operation attempted"
console.log(safeDivide(10, 0));   // "Cannot divide by zero", then logs "Operation attempted"
console.log(safeDivide(15, 3));   // 5, then logs "Operation attempted"
console.log(safeDivide(8, 4));    // 2, then logs "Operation attempted"


// Additional Test Cases to Verify All Problems
console.log('\n=== Additional Test Cases ===');

// Problem 1: Edge cases
console.log('Type of NaN:', checkVariable(NaN));        // number (typeof NaN is 'number')
console.log('Type of function:', checkVariable(() => {})); // object
console.log('Type of Symbol:', checkVariable(Symbol('id'))); // symbol (fallback to object)

// Problem 2: Various counts
console.log('Generate IDs (count=3):', generateIDs(3));   // ["ID-0", "ID-1", "ID-2"]
console.log('Generate IDs (count=8):', generateIDs(8));   // IDs 0-7 except 5

// Problem 3: Multiple calls
try {
    console.log('Sum (5 numbers):', calculateTotal(5, 10, 15, 20, 25));  // 75
} catch (error) {
    console.error('Error:', error.message);
}

// Problem 4: Custom test
const testPlayers = [
    { name: 'Player1', score: 12 },
    { name: 'Player2', score: 8 },
    { name: 'Player3', score: 9 }
];
console.log('Top scorers:', getTopScorers(testPlayers));

// Problem 5: Create multiple items
const items = [
    new Item('Book', 100),
    new Item('Pen', 20),
    new Item('Notebook', 50)
];
items.forEach(item => {
    console.log(`${item.name}: ₱${item.price} -> ₱${item.finalPrice}`);
});

// Problem 6: More divisions
console.log(safeDivide(100, 4));    // 25, logs "Operation attempted"
console.log(safeDivide(0, 5));      // 0, logs "Operation attempted"
console.log(safeDivide(5, 0));      // Error message, logs "Operation attempted"