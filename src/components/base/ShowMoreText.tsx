import { useEffect, useState } from 'react';
import dompurify from 'dompurify';
import './ShowMoreText.scss';
import { capitalize } from '../../utils/util';

const ShowMoreText: React.FC<{ text: string }> = ({ text }) => {
    const sanitizer = dompurify.sanitize;
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [textValue, setTextValue] = useState<string>('');

    useEffect(() => {
        if (text) {
            setTextValue(capitalize(sanitizer(text)));
        } else {
            setTextValue('');
        }
    }, [text]);

    return (
        <>
            <span
                className="show-more-text"
                dangerouslySetInnerHTML={{
                    __html: isExpanded || text.length <= 150 ? textValue : textValue.substring(0, 150) + '... '
                }}
            ></span>
            {text.length > 150 && (
                <span>
                    <a
                        className={isExpanded ? 'show-more expanded' : 'show-more'}
                        onClick={() => {
                            setIsExpanded(!isExpanded);
                        }}
                    >
                        {isExpanded ? 'Show less' : 'Show more'}
                    </a>
                </span>
            )}
        </>
    );
};
export default ShowMoreText;
