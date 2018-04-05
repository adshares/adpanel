package adsharesDemo;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class DesktopPage {

    @FindBy(css = "#mat-dialog-0 > app-account-choose-dialog > mat-dialog-content > h6")
    private WebElement userPopUp;


    private WebDriver driver;
    private WebDriverWait wait;

    public DesktopPage(WebDriver driver) {
        this.driver = driver;
        wait = new WebDriverWait(driver, 1000);
        PageFactory.initElements(driver, this);
    }

    public void pop() {
        wait.until(ExpectedConditions.visibilityOf(userPopUp));
    }

    boolean popUpSelector() {
        if (userPopUp.isEnabled()) {
            System.out.println(userPopUp.getText());
            return true;
        } else {
            return false;
        }
    }
}
