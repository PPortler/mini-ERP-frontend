import { useState } from "react";
import { ActionIcon, Group } from "@mantine/core";
import ConfirmModal from "../../../components/Models/ConfirmModel";
import type { PurchaseOrderType } from "../../../types/purchaes";
import { STATUS_PO } from "../../../constants/enum/enum";

// Icons
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import InventoryIcon from "@mui/icons-material/Inventory";
import DoneAllIcon from "@mui/icons-material/DoneAll";
// import DeleteIcon from "@mui/icons-material/Delete";
import { POConfirmMessage } from "../components/PoConfirmMassage";
import { notify } from "../../../utils/Notify";

export default function usePOActionColumn(
  handleEditPO: (po: PurchaseOrderType) => void,
  handleManageProducts: (po: PurchaseOrderType) => void,
  handleChangeStatus: (po: PurchaseOrderType, status: string) => void,
  handleDeletePO: (po: PurchaseOrderType) => void
) {
  const [confirmStatusOpen, setConfirmStatusOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const [currentPO, setCurrentPO] = useState<PurchaseOrderType | null>(null);
  const [nextStatus, setNextStatus] = useState<string>("");

  const openStatusConfirm = (po: PurchaseOrderType, status: string) => {
    if (status !== STATUS_PO.CANCELLED) {
      if (!po.purchase_order_items || po.purchase_order_items.length === 0) {
        notify({
          title: 'Cannot change status',
          message: 'Please add products to the PO before changing its status.',
          type: 'error',
        });
        return;
      }
    }

    setCurrentPO(po);
    setNextStatus(status);
    setConfirmStatusOpen(true);
  };

  // const openDeleteConfirm = (po: PurchaseOrderType) => {
  //   setCurrentPO(po);
  //   setConfirmDeleteOpen(true);
  // };

  const actionColumn = {
    header: "Action",
    accessor: "action",
    cell: (row: PurchaseOrderType) => {
      const buttons: React.ReactNode[] = [];

      if (row.status === STATUS_PO.DRAFT) {
        buttons.push(
          <ActionIcon
            key={`confirm-${row.purchase_order_id}`}
            color="blue"
            onClick={() => openStatusConfirm(row, STATUS_PO.CONFIRMED)}
            title="Confirm"
          >
            <CheckIcon fontSize="small" />
          </ActionIcon>
        );

        buttons.push(
          <ActionIcon
            key={`manage-${row.purchase_order_id}`}
            color="teal"
            onClick={() => handleManageProducts(row)}
            title="Manage Products"
          >
            <InventoryIcon fontSize="small" />
          </ActionIcon>
        );

        buttons.push(
          <ActionIcon
            key={`edit-${row.purchase_order_id}`}
            color="cyan"
            onClick={() => handleEditPO(row)}
            title="Edit PO"
          >
            <EditIcon fontSize="small" />
          </ActionIcon>
        );

        buttons.push(
          <ActionIcon
            key={`cancel-${row.purchase_order_id}`}
            color="red"
            onClick={() => openStatusConfirm(row, STATUS_PO.CANCELLED)}
            title="Cancel"
          >
            <CancelIcon fontSize="small" />
          </ActionIcon>
        );
        // buttons.push(
        //   <ActionIcon
        //     key={`delete-${row.purchase_order_id}`}
        //     color="red"
        //     onClick={() => openStatusConfirm(row, STATUS_PO.CANCELLED)}
        //     title="Delete PO"
        //   >
        //     <DeleteIcon fontSize="small" />
        //   </ActionIcon>
        // );
      }

      else if (row.status === STATUS_PO.CONFIRMED) {
        buttons.push(
          <ActionIcon
            key={`received-${row.purchase_order_id}`}
            color="green"
            onClick={() => openStatusConfirm(row, STATUS_PO.RECEIVED)}
            title="Received"
          >
            <DoneAllIcon fontSize="small" />
          </ActionIcon>
        );

        buttons.push(
          <ActionIcon
            key={`view-${row.purchase_order_id}`}
            color="teal"
            onClick={() => handleManageProducts(row)}
            title="View Products"
          >
            <InventoryIcon fontSize="small" />
          </ActionIcon>
        );

        buttons.push(
          <ActionIcon
            key={`cancel-${row.purchase_order_id}`}
            color="red"
            onClick={() => openStatusConfirm(row, STATUS_PO.CANCELLED)}
            title="Cancel"
          >
            <CancelIcon fontSize="small" />
          </ActionIcon>
        );
      }

      else {
        buttons.push(
          <ActionIcon
            key={`view-${row.purchase_order_id}`}
            color="teal"
            onClick={() => handleManageProducts(row)}
            title="View Products"
          >
            <InventoryIcon fontSize="small" />
          </ActionIcon>
        );
      }

      return (
        <>
          <Group gap="xs">{buttons}</Group>
          {currentPO && (
            <ConfirmModal
              opened={confirmStatusOpen && currentPO.purchase_order_id === row.purchase_order_id}
              onClose={() => setConfirmStatusOpen(false)}
              title="Confirm Change PO Status"
              message={
                <POConfirmMessage po={currentPO} nextStatus={nextStatus} />
              }
              onConfirm={() => {
                if (currentPO) handleChangeStatus(currentPO, nextStatus);
                setConfirmStatusOpen(false);
              }}
            />
          )}

          {currentPO && (
            <ConfirmModal
              opened={confirmDeleteOpen && currentPO.purchase_order_id === row.purchase_order_id}
              onClose={() => setConfirmDeleteOpen(false)}
              title="Confirm Delete PO"
              message="Do you want to delete this Purchase Order?"
              onConfirm={() => {
                if (currentPO) handleDeletePO(currentPO);
                setConfirmDeleteOpen(false);
              }}
            />
          )}
        </>
      );
    },
  };

  return actionColumn;
}
