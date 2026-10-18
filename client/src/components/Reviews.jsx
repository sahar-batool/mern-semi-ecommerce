import { useEffect, useState } from "react";
import { getReviews, createReview, updateReview, deleteReview } from "../api/review";
import { useAuth } from "../context/AuthContext"; 
import { StarDisplay, StarInput } from "./Stars";

export default function Reviews({ productId, onChange }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const  data  = await getReviews(productId);
      setReviews(data);
    } catch {
      setError("Could not load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [productId]);

  const myReview = user && reviews.find((r) => r.user?._id === user._id);

  const resetForm = () => {
    setRating(0);
    setComment("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (rating < 1) return setError("Please choose a rating");

    try {
      if (editingId) {
        await updateReview(editingId, { rating, comment });
      } else {
        await createReview(productId, { rating, comment });
      }
      resetForm();
      await load();
      onChange?.(); // tell the product page to refetch the product
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const startEdit = (r) => {
    setEditingId(r._id);
    setRating(r.rating);
    setComment(r.comment || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReview(id);
      await load();
      onChange?.();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete");
    }
  };

  return (
    <section className="reviews">
      <h2>Reviews</h2>

      {user && (!myReview || editingId) && (
        <form onSubmit={handleSubmit} className="review-form">
          <StarInput value={rating} onChange={setRating} />
          <textarea
            placeholder="Write your review (optional)"
            value={comment}
            maxLength={1000}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit">{editingId ? "Update review" : "Submit review"}</button>
          {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
        </form>
      )}

      {!user && <p>Log in to write a review.</p>}
      {error && <p className="error">{error}</p>}
      {loading && <p>Loading reviews...</p>}
      {!loading && reviews.length === 0 && <p>No reviews yet.</p>}

      {reviews.map((r) => {
        const isOwner = user && r.user?._id === user._id;
        const canDelete = isOwner || user?.role === "admin";
        return (
          <div key={r._id} className="review">
            <div className="review-head">
              <strong>{r.user?.name || "Deleted user"}</strong>
              <StarDisplay value={r.rating} />
              <small>{new Date(r.createdAt).toLocaleDateString()}</small>
            </div>
            {r.comment && <p>{r.comment}</p>}
            {isOwner && <button onClick={() => startEdit(r)}>Edit</button>}
            {canDelete && <button onClick={() => handleDelete(r._id)}>Delete</button>}
          </div>
        );
      })}
    </section>
  );
}