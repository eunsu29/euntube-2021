const deleteBtns = document.querySelectorAll(".deleteBtn");
const form = document.getElementById("commentForm");
const videoComments = document.querySelector(".video__comments ul");
const videoContainer = document.getElementById("videoContainer");

const addComment = (text, newCommentId) => {
  const newComment = document.createElement("li");
  newComment.dataset.id = newCommentId;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.id = "newDeleteBtn";
  span2.className = "deleteBtn";
  span2.innerText = " ❌";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
  textarea.value = "";
  const newDeleteBtn = document.getElementById("newDeleteBtn");
  newDeleteBtn.addEventListener("click", handleDelete);
};

const handleDelete = async (event) => {
  const liDelete = event.target.parentElement;
  const commentId = liDelete.dataset.id;
  await fetch(`/api/comments/${commentId}/delete`, {
    method: "DELETE",
  });
  liDelete.remove();
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

for (const deleteBtn of deleteBtns) {
  deleteBtn.addEventListener("click", handleDelete);
}
