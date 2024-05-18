export default function textWithLinks(props) {
    const link_indicator = /\[(.*?)\]\(([^)]*?)\)/g;
    const newText = props.text.replace(link_indicator, (match, text, link) => {
        return `<a href="${link}" target="_blank">${text}</a>`;
    });

    return (
        <div id="text-with-links"  dangerouslySetInnerHTML={{ __html: newText }} />
    );
}