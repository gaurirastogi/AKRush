import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';

const RusheeDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const [rushee, setRushee] = useState({ comments: {} });
  const [commentText, setCommentText] = useState('');
  const [commentType, setCommentType] = useState('pros');
  const [editingComment, setEditingComment] = useState(null);

  useEffect(() => {
    fetchRusheeDetails();
  }, [id]);

  const fetchRusheeDetails = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/rushees/${id}`);
      setRushee(response.data || { comments: {} });
    } catch (error) {
      console.error('Error fetching the rushee details:', error);
    }
  };

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  const handleTypeChange = (event) => {
    setCommentType(event.target.value);
  };

  const addComment = async () => {
    const data = { [commentType]: commentText };
    try {
      await axios.post(`http://127.0.0.1:5000/api/rushees/${id}/comments`, data);
      setCommentText('');
      fetchRusheeDetails();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const editComment = async () => {
    try {
      await axios.put(`http://127.0.0.1:5000/api/rushees/${id}/comments/${editingComment.type}/${editingComment.index}`, { comment: commentText });
      setEditingComment(null);
      setCommentText('');
      fetchRusheeDetails();
    } catch (error) {
      console.error('Failed to edit comment:', error);
    }
  };

  const deleteComment = async () => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/rushees/${id}/comments/${editingComment.type}/${editingComment.index}`);
      setEditingComment(null);
      fetchRusheeDetails();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleEditClick = (type, index) => {
    if (editingComment && editingComment.type === type && editingComment.index === index) {
      editComment();
    } else {
      setEditingComment({ type, index });
      setCommentText(rushee.comments[type].split('|')[index]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <button onClick={() => history.goBack()} className="mb-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
        Back
      </button>
      <h1 className="text-3xl font-bold my-8">{rushee.name}</h1>
      <img src={`http://127.0.0.1:5000/static/${rushee.photo}`} alt={rushee.name} className="h-32 w-32 rounded-full mb-4" />
      <p><strong>Major:</strong> {rushee.major}</p>
      <div>
        <select value={commentType} onChange={handleTypeChange} className="border p-2 mb-2 rounded">
          <option value="pros">Pros</option>
          <option value="cons">Cons</option>
          <option value="vouches">Vouches</option>
          <option value="anti-vouches">Anti-Vouches</option>
        </select>
        <textarea value={commentText} onChange={handleCommentChange} className="border p-2 w-full rounded" placeholder="Add a comment..." rows="3"></textarea>
        <button onClick={addComment} className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Comment</button>
      </div>
      <table className="w-full mt-4 text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="py-3 px-6">Pros</th>
            <th scope="col" className="py-3 px-6">Cons</th>
            <th scope="col" className="py-3 px-6">Vouches</th>
            <th scope="col" className="py-3 px-6">Anti-Vouches</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {['pros', 'cons', 'vouches', 'anti-vouches'].map((type) => (
              <td key={type} className="py-4 px-6">
                {rushee.comments[type]?.split('|').map((comment, index) => (
                  <div key={index} className="flex items-center justify-between mb-2">
                    <textarea readOnly={!editingComment || editingComment.type !== type || editingComment.index !== index} value={editingComment && editingComment.type === type && editingComment.index === index ? commentText : comment} onChange={editingComment && editingComment.type === type && editingComment.index === index ? handleCommentChange : undefined} className="border p-1 w-full"/>
                    <button onClick={() => handleEditClick(type, index)} className={`ml-2 ${editingComment && editingComment.type === type && editingComment.index === index ? 'bg-green-500' : 'bg-yellow-500'} text-white font-bold py-1 px-2 rounded`}>
                      {editingComment && editingComment.type === type && editingComment.index === index ? 'Save' : 'Edit'}
                    </button>
                    <button onClick={() => { setEditingComment({ type, index }); deleteComment(); }} className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Delete</button>
                  </div>
                ))}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RusheeDetails;