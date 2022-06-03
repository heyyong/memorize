import { h, FunctionComponent } from 'preact';
import style from './style.css';

export const H5: FunctionComponent = (props) => {
    return (
        <h5 class={style.h5}>{props.children}</h5>
    )
}