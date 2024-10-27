🗓️ 23102024 2344
📎 #shell

# bash

```bash
#!/bin/bash

# Bash Cheat Sheet

# 1. VARIABLES
echo "=== Variables ==="
# Defining a variable (no spaces around '=')
NAME="Bash Scripting"
echo "Variable: \$NAME is $NAME"

# 2. IF-ELSE STATEMENTS
echo "=== If-Else ==="
NUM=10
if [ $NUM -gt 5 ]; then
  echo "$NUM is greater than 5"
else
  echo "$NUM is less than or equal to 5"
fi

# 3. LOOPS
echo "=== Loops ==="
# For loop
echo "For loop example:"
for i in {1..5}; do
  echo "Iteration $i"
done

# While loop
echo "While loop example:"
COUNTER=1
while [ $COUNTER -le 3 ]; do
  echo "Counter is $COUNTER"
  ((COUNTER++))  # Increment counter
done

# 4. FUNCTIONS
echo "=== Functions ==="
# Function declaration
greet() {
  local GREETING="Hello, $1!"  # Local variable
  echo $GREETING
}

# Call the function
greet "World"

# 5. CASE STATEMENTS
echo "=== Case Statements ==="
read -p "Enter a letter (a/b/c): " LETTER
case $LETTER in
  a)
    echo "You entered A"
    ;;
  b)
    echo "You entered B"
    ;;
  c)
    echo "You entered C"
    ;;
  *)
    echo "Invalid option"
    ;;
esac

# 6. INTERACTING WITH SHELL COMMANDS
echo "=== Interacting with Shell Commands ==="
# Capturing the output of a command into a variable
CURRENT_DIR=$(pwd)
echo "The current directory is: $CURRENT_DIR"

# Listing files in the current directory
echo "Files in the current directory:"
ls

# Redirecting output to a file
echo "Writing to a file..."
echo "Hello, file!" > output.txt
cat output.txt  # Display the file content

# Piping commands
echo "Piping commands:"
echo "This is a sentence." | grep "sentence"

# 7. USER INPUT
echo "=== User Input ==="
read -p "Enter your name: " USER_NAME
echo "Hello, $USER_NAME!"

# 8. EXIT STATUS
echo "=== Exit Status ==="
# Every command returns an exit status. 0 means success.
ls > /dev/null  # Suppress output
if [ $? -eq 0 ]; then
  echo "ls command was successful"
else
  echo "ls command failed"
fi

# 9. FILE TESTS
echo "=== File Tests ==="
# Check if a file exists
if [ -f output.txt ]; then
  echo "File 'output.txt' exists."
else
  echo "File 'output.txt' does not exist."
fi

# 10. STRING MANIPULATION
echo "=== String Manipulation ==="
STR="Bash scripting is powerful"
echo "Original String: $STR"
echo "String Length: ${#STR}"
echo "Substring (7 characters from index 5): ${STR:5:7}"

## FOR LOOP
for i in {1..5}; do
  echo "Iteration $i"
done

# Loop over a list of items
for fruit in apple banana cherry; do
  echo "I like $fruit"
done

for ((i = 1; i <= 5; i++)); do
  echo "Counter: $i"
done


echo "=== End of Cheat Sheet ==="

```

---

# References
