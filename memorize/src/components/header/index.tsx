import { FunctionalComponent, h } from 'preact';
import style from './style.css';

const Header: FunctionalComponent<{ progress?: number }> = (props) => {
    return (
        <header class={style.header}>
            <div class={style.header_name}>
                <h1>Memorize</h1>
            </div>
        </header>
    );
};

export default Header;
