import React, { useEffect, useState } from "react";
import {
  fetchProduct,
  arama,
  updateQuantity,
  deleteProduct,
  productDelete,
  productCreate,
  productUpdate,
  setProductList,
} from "./redux/ProductSlicer";
import { useAppDispatch, useAppSelector } from "./redux/store";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import {
  addList,
  clearList,
  setList,
  updateQuantityAmount,
} from "./redux/ChecklistSlicer";

function App() {
  const dispatch: any = useAppDispatch();
  const {
    data: products,
    error,
    loading,
  } = useAppSelector((state) => state.products);
  const { data: checkList } = useAppSelector((state) => state.checklist);

  const [updateList, setUpdateList] = useState([]);

  const [checkTrigger, setCheckTrigger] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const [aramaText, setAramaText] = useState("");

  const [useModalVisible, setUseModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const [name, setName] = useState("");
  const [quantityAmount, setQuantityAmount] = useState(0);
  const [price, setPrice] = useState(0);

  const [zeroStockVisible, setZeroStockVisible] = useState(false);

  const [limitationList, setLimitationList] = useState([]);
  const [limitationTrigger, setLimitationTrigger] = useState(false);

  const init = async () => {
    await dispatch(fetchProduct());
    // dispatch(clearZeroAmount());
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    setUpdateList(updateList);
  }, [updateTrigger]);

  useEffect(() => {
    setLimitationList(limitationList);
  }, [limitationTrigger]);

  const useProduct = () => {
    setUseModalVisible(!useModalVisible);
    checkList.map((data: any, index: number) => {
      var prod: any = products.find((e: any) => e.id === data.id);
      const newQ = prod.quantity - data.quantity;
      dispatch(
        productUpdate({
          id: data.id,
          name: data.name,
          quantity: newQ,
          price: data.price,
        })
      ).then(() => {
        dispatch(updateQuantity({ id: data.id, quantity: newQ }));
      });
      // dispatch(clearZeroAmount());
    });

    dispatch(clearList());
    // dispatch(clearZeroAmount());
  };

  const clearAddForm = () => {
    setName("");
    setQuantityAmount(0);
    setPrice(0);
  };
  const setUpdate = (data: any) => {
    const index = updateList.findIndex((e: any) => e.id === data.id);
    if (index !== -1) {
      //updateList'te varsa
      const tmpUpdateList = updateList.filter((e: any) => e.id !== data.id);
      setUpdateList(tmpUpdateList);
    } else {
      const tmpData: any = updateList;
      tmpData.push(data);
      setUpdateList(tmpData);
    }
    setUpdateTrigger(!updateTrigger);
  };

  const isLimitation = (id: any, value: any) => {
    var { quantity: pQ } = products.find((e: any) => e.id === id);
    setLimitationTrigger(!limitationTrigger);
    return value > pQ ? true : false;
  };
  const isChecked = (id: any) => {
    return checkList.findIndex((e: any) => e.id === id) !== -1 ? true : false;
  };

  const isUpdated = (id: any) => {
    return updateList.findIndex((e: any) => e.id === id) !== -1 ? true : false;
  };

  const Arama = (text: any) => {
    setAramaText(text);
    if (text.length > 0) {
      dispatch(arama(text));
    } else {
      dispatch(fetchProduct());
    }
  };

  return (
    <React.Fragment>
      <div className="container mt-5 input-group flex-nowrap">
        <span className="input-group-text" id="addon-wrapping">
          Arama
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="??r??n Aray??n"
          aria-label="??r??n Aray??n"
          aria-describedby="addon-wrapping"
          onChange={(e) => Arama(e.target.value)}
          value={aramaText}
        />
      </div>

      <div
        className="container mt-5"
        style={{
          width: "100%",
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          className="btn btn-success"
          onClick={() => {
            setAddModalVisible(!addModalVisible);
          }}
        >
          +
        </button>
        <button
          type="button"
          className="btn btn-secondary mx-2"
          onClick={() => {
            checkList.length > 0
              ? setUseModalVisible(!useModalVisible)
              : alert(
                  "??r??n kullanabilmeniz i??in se??im yapman??z gerekmektedir."
                );
          }}
        >
          {checkList.length > 0
            ? `${checkList.length} adet ??r??n?? kullan`
            : "Kullan??lacak ??r??n se??iniz."}
        </button>

        <button
          type="button"
          className={
            zeroStockVisible ? "btn btn-warning mx-2" : "btn btn-danger mx-2"
          }
          onClick={() => {
            setZeroStockVisible(!zeroStockVisible);
          }}
        >
          {zeroStockVisible
            ? "Stok bulunmayan ??r??nleri gizle"
            : "Stok bulunmayan ??r??nleri g??ster"}
        </button>
      </div>
      <div
        className="container mt-5"
        style={{
          width: "100%",
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {checkList.length !== products.length && (
          <button
            className="btn btn-secondary mx-2"
            onClick={() => {
              dispatch(setList(products));
            }}
          >
            T??m??n?? se??
          </button>
        )}
        {checkList.length !== 0 && (
          <button
            className="btn btn-secondary mx-2"
            onClick={() => {
              setCheckTrigger(!checkTrigger);
              dispatch(clearList());
            }}
          >
            Se??ilileri kald??r
          </button>
        )}
      </div>

      <div className="container">
        <table className="table .table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">ID</th>
              <th scope="col">??r??n Ad??</th>
              <th scope="col" style={{ textAlign: "center" }}>
                Stok Adedi
              </th>
              <th scope="col">Fiyat</th>
              <th scope="col">Eylemler</th>
            </tr>
          </thead>
          <tbody>
            {error && <tr>{error}</tr>}

            {products.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  ??r??n bulunmamaktad??r.
                </td>
              </tr>
            ) : (
              products.length > 0 &&
              products?.map((data: any, index: string) => {
                if (zeroStockVisible || data.quantity !== 0)
                  return (
                    <tr key={index}>
                      <td style={{ width: "5%" }}>
                        <input
                          checked={isChecked(data.id)}
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          onChange={() => {
                            dispatch(addList(data));
                          }}
                        />
                      </td>
                      <td style={{ width: "5%" }}>{data.id}</td>
                      <td style={{ width: "20%" }}>{data.name}</td>
                      <td style={{ width: "35%", textAlign: "center" }}>
                        {isUpdated(data.id) ? (
                          <div className="container   input-group flex-nowrap">
                            <span
                              className="input-group-text"
                              id="addon-wrapping"
                            >
                              G??ncel stok girin.
                            </span>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="G??ncel stok girin."
                              aria-label="G??ncel stok girin."
                              aria-describedby="addon-wrapping"
                              onChange={(e: any) => {
                                dispatch(
                                  updateQuantity({
                                    id: data.id,
                                    quantity: parseInt(e.target.value),
                                  })
                                );

                                var tmpData: any = products;
                                var index: any = tmpData.findIndex(
                                  (e: any) => e.id === data.id
                                );
                                tmpData[index].quantity = e.target.value;
                                dispatch(setProductList(tmpData));
                              }}
                              value={data.quantity}
                            />
                          </div>
                        ) : (
                          products.find((e: any) => e.id === data.id).quantity
                        )}
                      </td>
                      <td style={{ width: "10%" }}>{data.price} ???</td>
                      {isUpdated(data.id) ? (
                        <td style={{ width: "30%" }}>
                          <button
                            className="btn btn-success"
                            onClick={() => {
                              dispatch(productUpdate(data)).then(() => {
                                setUpdate(data);
                                setUpdateTrigger(!updateTrigger);
                                // dispatch(clearZeroAmount());
                              });
                            }}
                          >
                            Kaydet
                          </button>
                        </td>
                      ) : (
                        <td style={{ width: "25%" }}>
                          {loading ? (
                            <button className="btn btn-danger">...</button>
                          ) : (
                            <button
                              className="btn btn-danger"
                              onClick={(e: any) => {
                                dispatch(productDelete(data.id)).then(() => {
                                  dispatch(deleteProduct(data.id));
                                });
                              }}
                            >
                              Sil
                            </button>
                          )}
                          <button
                            className="btn btn-warning mx-2"
                            onClick={() => {
                              setUpdate(data);
                              setUpdateTrigger(!updateTrigger);
                            }}
                          >
                            Stok G??ncelle
                          </button>
                        </td>
                      )}
                    </tr>
                  );
              })
            )}
          </tbody>
        </table>

        {useModalVisible && checkList.length > 0 && (
          <Modal
            show={useModalVisible}
            onHide={() => setUseModalVisible(!useModalVisible)}
            size="lg"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>??r??n kullanma ekran??</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {
                <table className="table .table-hover">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">??r??n Ad??</th>
                      <th scope="col">Stok Adedi</th>
                      <th scope="col">Fiyat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {error && <tr>{error}</tr>}
                    {loading ? (
                      <tr>Y??kleniyor...</tr>
                    ) : (
                      checkList.length > 0 &&
                      checkList?.map((data: any, index: number) => {
                        return (
                          <tr key={index}>
                            <td style={{ width: "5%" }}>{data.id}</td>
                            <td style={{ width: "20%" }}>{data.name}</td>
                            <td style={{ width: "35%" }}>
                              {
                                <div className="container input-group flex-nowrap">
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="G??ncel stok girin."
                                    aria-label="G??ncel stok girin."
                                    aria-describedby="addon-wrapping"
                                    onChange={(e: any) => {
                                      if (e.target.value == 0) {
                                        var tmpData: any = checkList.filter(
                                          (k: any) => k.id !== data.id
                                        );
                                        dispatch(setList(tmpData));
                                      }
                                      if (
                                        isLimitation(data.id, e.target.value)
                                      ) {
                                        var tmpData: any = limitationList;
                                        tmpData.push(data);
                                        alert(
                                          "Kullan??lmak istenilen miktar, ??r??n sto??undan fazlad??r!"
                                        );
                                        setLimitationList(tmpData);
                                      } else {
                                        dispatch(
                                          updateQuantityAmount({
                                            id: data.id,
                                            quantity: e.target.value,
                                          })
                                        );
                                      }
                                    }}
                                    value={data.quantity}
                                  />
                                </div>
                              }
                            </td>
                            <td style={{ width: "10%" }}>{data.price} ???</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              }
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setUseModalVisible(!useModalVisible)}
              >
                Kapat
              </Button>
              <Button variant="success" onClick={useProduct}>
                Kullan
              </Button>
            </Modal.Footer>
          </Modal>
        )}
        {addModalVisible && (
          <Modal
            show={addModalVisible}
            onHide={() => setAddModalVisible(!addModalVisible)}
            size="lg"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>??r??n ekleme ekran??</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>??r??n Ad??</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="??r??n ad??n?? giriniz"
                    value={name}
                    onChange={(e: any) => setName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>??r??n Sto??unu Giriniz</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="??r??n sto??unu giriniz"
                    value={quantityAmount}
                    onChange={(e: any) => setQuantityAmount(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>??r??n Fiyat??n?? Giriniz</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="??r??n fiyat??n?? giriniz"
                    value={price}
                    onChange={(e: any) => setPrice(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setAddModalVisible(!addModalVisible)}
              >
                Kapat
              </Button>
              <Button
                variant="success"
                onClick={() => {
                  dispatch(
                    productCreate({
                      name: name,
                      quantity: quantityAmount,
                      price: price,
                    })
                  );
                  setAddModalVisible(!addModalVisible);
                  clearAddForm();
                }}
              >
                Ekle
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </React.Fragment>
  );
}

export type Root = Product[];

export interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export default App;
