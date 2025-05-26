/**
 * Base Presenter
 * 
 * Abstract base class for all presenters in the MCP pattern.
 * Handles common functionality like view registration and updates.
 */

export interface View {
  render(): void;
  update(data: any): void;
}

export abstract class BasePresenter<T extends View> {
  protected view: T | null = null;
  
  /**
   * Attach a view to this presenter
   * @param view - The view to attach
   */
  attachView(view: T): void {
    this.view = view;
  }
  
  /**
   * Detach the current view
   */
  detachView(): void {
    this.view = null;
  }
  
  /**
   * Check if a view is currently attached
   */
  hasView(): boolean {
    return this.view !== null;
  }
  
  /**
   * Update the attached view with new data
   * @param data - Data to update the view with
   */
  updateView(data: any): void {
    if (this.view) {
      this.view.update(data);
    }
  }
}
