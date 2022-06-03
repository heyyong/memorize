import { h, FunctionComponent } from 'preact';
import style from './style.css';

export const H1: FunctionComponent = (props) => {
    return (
        <h1 class={style.h1}>{props.children}</h1>
    )
}