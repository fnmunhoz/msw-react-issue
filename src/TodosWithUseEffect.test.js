import { useEffect, useState } from "react";
import fetch from "node-fetch";
import { render, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";

// App BEGIN

const Todos = () => {
  // TODOS1

  const [todos1, setTodos1] = useState();

  useEffect(() => {
    const fetchTodos = async () => {
      if (todos1) return;

      const response = await fetch("http://localhost/todos");
      const data = await response.json();

      console.log("Got a response for todos1", data);

      setTodos1(data);
    };
    fetchTodos();
  }, [todos1]);

  // TODOS2

  const [todos2, setTodos2] = useState();

  useEffect(() => {
    const fetchTodos = async () => {
      if (todos2) return;

      const response = await fetch("http://localhost/todos");
      const data = await response.json();

      console.log("Got a response for todos2", data);

      setTodos2(data);
    };
    fetchTodos();
  }, [todos2]);

  // RENDER

  if (!todos1 || !todos2) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ul>
        {todos1.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}

        {todos2.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
};

// App END

// -------------

// Test BEGIN

const server = setupServer();

beforeAll(() => {
  server.listen({
    onUnhandledRequest: "warn",
  });
});

afterAll(() => {
  server.close();
});

test("renders todo items", async () => {
  server.use(
    rest.get("/todos", (req, res, ctx) => {
      // Expected to respond once, so the test should fail

      return res.once(
        ctx.json([
          {
            id: 1,
            title: "todo item",
          },
        ])
      );
    })
  );

  render(<Todos />);

  const todos = await screen.findAllByText(/todo item/i);
  expect(todos[0]).toBeInTheDocument();
  expect(todos[1]).toBeInTheDocument();
});

// Test END
