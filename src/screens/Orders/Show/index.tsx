import React, {useEffect} from "react";
import OrdersShowStore from "./store";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import styles from "./styles.m.styl";
import Item from "./components/Item";

type ShowParams = {
  id: string;
};

const OrdersShow = observer(
  (): JSX.Element => {
    const [state] = React.useState(new OrdersShowStore());
    const {id} = useParams<ShowParams>();

    useEffect(() => {
      if (state.initialized) return;
      state.initialize(id);
    });

    return (
      <div className={styles.screenWrapper}>
        <div className={styles.screen}>
            {state.loading ?
                <span>Loading...</span>
                :
                <div className={styles.items}>
                    {
                        state.itemsExist ?
                            (state.order?.items?.map((item) => (
                                <Item key={item.id} item={item} />
                            )))
                            :
                            <span>Товары не найдены!</span>
                    }
                </div>
            }
        </div>
      </div>
    );
  }
);

export default OrdersShow;
