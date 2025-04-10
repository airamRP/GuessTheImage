// src/components/ItemCard.jsx
function ItemCard({ imageUrl, attempts, index, gameStatus }) {
  return (
    <div className="image-card">
      <img src={imageUrl} alt="Item" className="item-image" />
      {attempts.map((attempt, i) => (
        <div key={i} className={`guess ${attempt.feedback[index] || ''}`}>
          {attempt.guesses[index] || '¿?'}
        </div>
      ))}
      {attempts.length === 0 && gameStatus !== 'won' && (
        <div className="guess">¿?</div>
      )}
    </div>
  );
}

export default ItemCard;