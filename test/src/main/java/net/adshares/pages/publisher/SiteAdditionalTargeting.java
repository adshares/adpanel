package net.adshares.pages.publisher;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

import java.util.List;
import java.util.Random;

public class SiteAdditionalTargeting {

    @FindBy(xpath = "//div[@class='adsh-circle done']/following-sibling::p[contains(text(),'Basic Information')]")
    private WebElement checkFlowChart;
    @FindBy(xpath = "//span[starts-with(text(), 'Save & Continue')]")
    private WebElement saveButtonPublisherCampaign;
    @FindBy(xpath = "//button[contains(text(), 'Save as Draft')]")
    private WebElement backButtonPublisherCampaign;
    /**
     * Requires List
     */
    @FindBy(xpath = "//div[@class ='ng-star-inserted']")
    private WebElement publisherlistComponents;

    @FindBy(xpath = "//span[contains(text(),'Creative type')]")
    private WebElement publisherCreativeType;

    @FindBy(css = "div.targeting-select-wrapper")
    private WebElement publisherList;

    @FindBy(xpath = "//button[contains(text(), 'Add Selected')]")
    private WebElement addSelectedButton;

    private WebDriver driver;
    private WebDriverWait wait;

    public SiteAdditionalTargeting(WebDriver driver) {
        this.driver = driver;
        wait = new WebDriverWait(driver, 1000);
        PageFactory.initElements(driver, this);
    }

    /**
     * default List index
     * 1st index = creative type
     * 2nd index = Language
     * 3rd index = Screen
     * 4th index = Js support
     */
    public void publisherRequiresCreativeType() {
        wait.until(ExpectedConditions.visibilityOf(publisherList));
        List<WebElement> pubList = publisherList.findElements(By.xpath("//div[@class ='ng-star-inserted']"));
        WebElement creaviteType = pubList.get(0);
        creaviteType.click();
        //mat-expansion-panel[contains(@class,'  mat-expanded mat-expansion-panel-spacing')]
        //*[contains(concat(' ', @class, ' '), ' atag ')]

        //mat-expansion-panel[contains(concat(' ', @class, ' '), ' mat-expansion-panel ') and contains(concat(' ', @class, ' '), ' ng-tns-c25-7 ')]

        List<WebElement> od = publisherList.findElements(By.xpath("//mat-expansion-panel[contains(@class,'mat-expansion-panel mat-expanded mat-expansion-panel-spacing')]//div[@class = 'adsh-form-input__box']/following-sibling::div[@class = 'ng-star-inserted']"));
        for (int i = 0; i < 3; i++) {
            int random = (int) (Math.random() * (1) + (-3));
            Random rand = new Random();
            int randomProduct = rand.nextInt(od.size());
            od.get(randomProduct).click();
            Assert.assertTrue(addSelectedButton.isEnabled());
        }
        addSelectedButton.click();
    }

    public void publisherRequiresLanguage() {
        wait.until(ExpectedConditions.visibilityOf(publisherList));
        List<WebElement> pubList = publisherList.findElements(By.xpath("//div[@class ='ng-star-inserted']"));
        WebElement creaviteType = pubList.get(1);
        creaviteType.click();
        List<WebElement> od = publisherList.findElements(By.xpath("//mat-expansion-panel[@class='mat-expansion-panel ng-tns-c25-7 mat-expanded mat-expansion-panel-spacing']//div[@class = 'adsh-form-input__box']/following-sibling::div[@class = 'ng-star-inserted']"));
        for (int i = 0; i < 2; i++) {
            int random = (int) (Math.random() * (1) + (-2));
            Random rand = new Random();
            int randomProduct = rand.nextInt(od.size());
            od.get(randomProduct).click();
            Assert.assertTrue(addSelectedButton.isEnabled());
        }
        addSelectedButton.click();
    }

    public void publisherRequiresJsSupport() {
        wait.until(ExpectedConditions.visibilityOf(publisherList));
        List<WebElement> pubList = publisherList.findElements(By.xpath("//div[@class ='ng-star-inserted']"));
        WebElement creaviteType = pubList.get(3);
        creaviteType.click();
        List<WebElement> od = publisherList.findElements(By.xpath("//mat-expansion-panel[@class='mat-expansion-panel ng-tns-c25-7 mat-expanded mat-expansion-panel-spacing']//div[@class = 'adsh-form-input__box']/following-sibling::div[@class = 'ng-star-inserted']"));
        for (int i = 0; i < 1; i++) {
            int random = (int) (Math.random() * (1) + (-1));
            Random rand = new Random();
            int randomProduct = rand.nextInt(od.size());
            od.get(randomProduct).click();
            Assert.assertTrue(addSelectedButton.isEnabled());
        }
        addSelectedButton.click();
    }

    public void goToCreateAds() {
        wait.until(ExpectedConditions.visibilityOf(saveButtonPublisherCampaign));
        saveButtonPublisherCampaign.click();
    }
}
