import {useDispatch, useSelector} from 'react-redux';
import {decrement, increment, setCount} from "../redux/CounterSlice";
import {AppDispatch, RootState} from "../redux/Store";

function Hello(props: {text:any}) {
    const count = useSelector((state: RootState) => state.counter.count);
    const dispatch = useDispatch<AppDispatch>();
    function add() {
        dispatch(increment());
    }

    function add2(){
        dispatch(setCount(count + 2));
    }

    function minus(){
        dispatch(decrement());
    }

    return (<div>
        <h1>Hello {props.text}: {count}</h1>
        <button onClick={add}>+1</button>
        <button onClick={add2}>+2</button>
        <button onClick={minus}>-1</button>
    </div>)
}
 export default Hello;