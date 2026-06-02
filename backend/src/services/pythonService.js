const { PythonShell } =
  require("python-shell");

async function runPython() {
  const result =
    await PythonShell.run(
      "./src/python/test.py"
    );

  return JSON.parse(result[0]);
}

module.exports = {
  runPython,
};