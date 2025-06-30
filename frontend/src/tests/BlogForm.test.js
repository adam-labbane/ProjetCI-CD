import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BlogForm from "../components/BlogForm";
import BLOG_API from "../services/blogApi";

jest.mock("../services/blogApi", () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

beforeEach(() => {
  window.alert = jest.fn(); // mocke l'alerte
});

describe("BlogForm", () => {
  it("soumet un nouveau post avec succès", async () => {
    BLOG_API.post.mockResolvedValue({});
    const onCreated = jest.fn();

    render(<BlogForm onCreated={onCreated} />);

    fireEvent.change(screen.getByPlaceholderText(/titre/i), {
      target: { value: "Mon titre de test", name: "title" },
    });
    fireEvent.change(screen.getByPlaceholderText(/contenu/i), {
      target: { value: "Mon contenu de test", name: "content" },
    });

    fireEvent.submit(screen.getByText(/publier/i).closest("form"));

    await waitFor(() => {
      expect(BLOG_API.post).toHaveBeenCalledWith("/posts", {
        title: "Mon titre de test",
        content: "Mon contenu de test",
      });
      expect(onCreated).toHaveBeenCalled();
    });
  });

  it("affiche une erreur en cas d'échec", async () => {
    BLOG_API.post.mockRejectedValue(new Error("Erreur API"));
    const onCreated = jest.fn();

    render(<BlogForm onCreated={onCreated} />);

    fireEvent.change(screen.getByPlaceholderText(/titre/i), {
      target: { value: "Titre KO", name: "title" },
    });
    fireEvent.change(screen.getByPlaceholderText(/contenu/i), {
      target: { value: "Contenu KO", name: "content" },
    });

    fireEvent.submit(screen.getByText(/publier/i).closest("form"));

    await waitFor(() => {
      expect(BLOG_API.post).toHaveBeenCalled();
      expect(onCreated).not.toHaveBeenCalled();
    });
  });
});
