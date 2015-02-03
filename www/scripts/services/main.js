function adder(a, b) {
  if (checkArgs(a, b)) {
    return a+b;
  } return "Error";
}

function checkArgs(a, b) {
  return (typeof a == "number" && typeof b == "number");
}