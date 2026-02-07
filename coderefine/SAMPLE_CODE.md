# Sample Code Files for Testing CodeRefine

## Python Example - Inefficient Code

```python
def find_duplicates(numbers):
    duplicates = []
    for i in range(len(numbers)):
        for j in range(len(numbers)):
            if i != j and numbers[i] == numbers[j]:
                if numbers[i] not in duplicates:
                    duplicates.append(numbers[i])
    return duplicates

def calculate_average(numbers):
    total = 0
    count = 0
    for i in range(len(numbers)):
        total = total + numbers[i]
        count = count + 1
    average = total / count
    return average

def is_prime(n):
    if n < 2:
        return False
    for i in range(2, n):
        if n % i == 0:
            return False
    return True

# Using the functions
nums = [1, 2, 3, 2, 4, 5, 3, 6, 7, 8, 7]
print("Duplicates:", find_duplicates(nums))
print("Average:", calculate_average(nums))
print("Is 17 prime?", is_prime(17))
```

## JavaScript Example - Code with Issues

```javascript
function processUserData(users) {
    var result = [];
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        if (user.age > 18) {
            var userInfo = {
                name: user.name,
                email: user.email,
                age: user.age
            };
            result.push(userInfo);
        }
    }
    return result;
}

function findUser(users, id) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            return users[i];
        }
    }
    return null;
}

var users = [
    {id: 1, name: "John", email: "john@example.com", age: 25},
    {id: 2, name: "Jane", email: "jane@example.com", age: 17},
    {id: 3, name: "Bob", email: "bob@example.com", age: 30}
];

console.log(processUserData(users));
console.log(findUser(users, "2"));
```

## Java Example - Needs Refactoring

```java
public class Calculator {
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        System.out.println(calc.add(5, 3));
        System.out.println(calc.multiply(4, 7));
    }
    
    public int add(int a, int b) {
        int result = 0;
        for (int i = 0; i < b; i++) {
            result = result + 1;
        }
        result = a + result;
        return result;
    }
    
    public int multiply(int a, int b) {
        int result = 0;
        for (int i = 0; i < b; i++) {
            result = result + a;
        }
        return result;
    }
    
    public int factorial(int n) {
        if (n == 0) {
            return 1;
        }
        int result = 1;
        for (int i = 1; i <= n; i++) {
            result = result * i;
        }
        return result;
    }
}
```

## C++ Example - Performance Issues

```cpp
#include <iostream>
#include <vector>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

vector<int> bubbleSort(vector<int> arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}

int main() {
    cout << "Fibonacci(10): " << fibonacci(10) << endl;
    
    vector<int> numbers = {64, 34, 25, 12, 22, 11, 90};
    vector<int> sorted = bubbleSort(numbers);
    
    cout << "Sorted array: ";
    for (int num : sorted) {
        cout << num << " ";
    }
    cout << endl;
    
    return 0;
}
```

## Go Example - Best Practice Violations

```go
package main

import "fmt"

func ProcessData(data []int) []int {
    var result []int
    for i := 0; i < len(data); i++ {
        if data[i] > 0 {
            result = append(result, data[i])
        }
    }
    return result
}

func FindMax(numbers []int) int {
    max := numbers[0]
    for i := 0; i < len(numbers); i++ {
        if numbers[i] > max {
            max = numbers[i]
        }
    }
    return max
}

func main() {
    data := []int{1, -2, 3, -4, 5, 6, -7, 8}
    positive := ProcessData(data)
    fmt.Println("Positive numbers:", positive)
    fmt.Println("Max value:", FindMax(positive))
}
```

## Expected Improvements

### Python
- Use set for duplicate detection (O(n) instead of O(n²))
- Use built-in `sum()` and `len()` for average
- Optimize prime check with sqrt limit
- Use list comprehensions

### JavaScript
- Use `const`/`let` instead of `var`
- Use `===` instead of `==`
- Use array methods (filter, map, find)
- Use arrow functions

### Java
- Remove inefficient loops in add/multiply
- Use built-in operators
- Add proper error handling
- Use BigInteger for large factorials

### C++
- Use memoization for fibonacci
- Replace bubble sort with std::sort
- Use references to avoid copies
- Add const correctness

### Go
- Use range loops instead of index loops
- Check for empty slices
- Use defer for cleanup
- Follow Go naming conventions
