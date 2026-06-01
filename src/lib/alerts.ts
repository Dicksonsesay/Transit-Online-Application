"use client";

import Swal, { type SweetAlertOptions, type SweetAlertResult } from "sweetalert2";

export { Swal };

export function showSuccess(title: string, text?: string): Promise<SweetAlertResult> {
  return Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonColor: "#003e91",
  });
}

export function showError(title: string, text?: string): Promise<SweetAlertResult> {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor: "#003e91",
  });
}

export function showWarning(title: string, text?: string): Promise<SweetAlertResult> {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    confirmButtonColor: "#003e91",
  });
}

export function confirmDelete(
  itemLabel = "this item",
  options?: SweetAlertOptions
): Promise<SweetAlertResult> {
  return Swal.fire({
    icon: "warning",
    title: "Are you sure?",
    text: `You are about to delete ${itemLabel}. This cannot be undone.`,
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
    reverseButtons: true,
    ...options,
  });
}

export function confirmAction(
  title: string,
  text?: string,
  options?: SweetAlertOptions
): Promise<SweetAlertResult> {
  return Swal.fire({
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#003e91",
    cancelButtonColor: "#6c757d",
    reverseButtons: true,
    ...options,
  });
}
