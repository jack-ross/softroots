import { Modal } from "antd";

export default function displayConfirmModal(onOkFunction) {
  Modal.confirm({
    title: "Delete?",
    content: "This action cannot be undone.",
    okText: "Delete",
    cancelText: "Cancel",
    onOk: onOkFunction,
    onCancel: () => {}
  });
}
