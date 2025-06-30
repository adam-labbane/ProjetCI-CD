import { render, screen, waitFor } from "@testing-library/react";
import BlogPosts from "../components/BlogPosts";
import BLOG_API from "../services/blogApi";

jest.mock("../services/blogApi", () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe("BlogPosts", () => {
  it("affiche la liste des posts en succès", async () => {
    BLOG_API.get.mockResolvedValue({
      data: [
        {
          _id: "1",
          title: "Test Post",
          content: "Test Content",
          createdAt: new Date().toISOString(),
        },
      ],
    });

    render(<BlogPosts />);

    expect(screen.getByText(/blog/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Test Post/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Content/i)).toBeInTheDocument();
    });
  });

  it("affiche rien si l'API échoue", async () => {
    BLOG_API.get.mockRejectedValue(new Error("Erreur API"));

    render(<BlogPosts />);

    expect(screen.getByText(/blog/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    });
  });
});
