import './OverflowText.scss';

const OverflowText: React.FC<{ text: string }> = ({ text }) => {
    return <div className="overflow-text">{text}</div>;
};

export default OverflowText;
