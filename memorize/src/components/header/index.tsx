import { FunctionalComponent, h } from 'preact';
import LinearProgress from '@mui/material/LinearProgress';
import style from './style.css';

const Header: FunctionalComponent<{ progress?: number }> = (props) => {
    return (
        <header class={style.header}>
            <div class={style.header_name}>
                <h1>Memorize</h1>
            </div>
            <div class={style.header_progress}>
                {props.progress !== undefined && <LinearProgress color="secondary" variant='determinate' value={props.progress} />}
            </div>
        </header>
    );
};

export default Header;
