package net.adshares.pages.publisher;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;
import java.util.Random;

public class SiteCreateAds {

    @FindBy(css = "div > app-edit-site-create-ad-units > section > div:nth-child(2) > button")
    private WebElement createAdUnitDropDownButton;
    @FindBy(css = "#shortHeadline")
    private WebElement nameOfUnit;
    @FindBy(css = "#mat-select-3 > div > div.mat-select-value")
    private WebElement adTypeSelecetList;
    @FindBy(css = "#mat-option-11")
    private WebElement adTypeHtml;
    @FindBy(xpath = "//span[starts-with(text(), 'Save & Continue')]")
    private WebElement saveButtonPublisherCampaign;


    private WebDriver driver;
    private WebDriverWait wait;

    public SiteCreateAds(WebDriver driver) {
        this.driver = driver;
        wait = new WebDriverWait(driver, 1000);
        PageFactory.initElements(driver, this);
    }

    public void createAdUnit() {
        wait.until(ExpectedConditions.visibilityOf(createAdUnitDropDownButton));
        createAdUnitDropDownButton.click();
    }

    public void adUnitTemplate() {
        wait.until(ExpectedConditions.visibilityOf(nameOfUnit));
        nameOfUnit.sendKeys("advertisment of testing");
        adTypeSelecetList.click();
        adTypeHtml.click();
        List<WebElement> od = driver.findElements(By.xpath("//*[@id='cdk-accordion-child-2']/div/div[3]//div[@class ='site-edit-create-ad-units__ad-unit ng-star-inserted']"));
        int random = (int) (Math.random() * (1) + (-3));
        Random rand = new Random();
        int randomProduct = rand.nextInt(od.size());
        od.get(randomProduct).click();
    }

    public void goToSummary() {
        wait.until(ExpectedConditions.visibilityOf(saveButtonPublisherCampaign));
        saveButtonPublisherCampaign.click();
    }

}
