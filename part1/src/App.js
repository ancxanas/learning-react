const Hello = ({ name, age }) => {
  console.log(name, age);
  const bornYear = () => new Date().getFullYear() - age;

  return (
    <>
      <p>
        Hello {name}, you are {age} years old.
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </>
  );
};

const App = (props) => {
  const { counter } = props;
  return <div>{counter}</div>;
};

export default App;
