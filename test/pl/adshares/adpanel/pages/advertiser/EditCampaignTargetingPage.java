package pl.adshares.adpanel.pages.advertiser;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import pl.adshares.adpanel.tools.Maps;

public class EditCampaignTargetingPage {

//  private static final String CSS_REQUIRE_BOX = "*[data-test='advertiser-edit-campaign-additional-targeting-accordion'] *[data-test='advertiser-edit-campaign-additional-targeting-accordion-panel-required']";
//  private static final String CSS_EXCLUDE_BOX = "*[data-test='advertiser-edit-campaign-additional-targeting-accordion'] *[data-test='advertiser-edit-campaign-additional-targeting-accordion-panel-excluded']";
//  private static final String CSS_REQUIRE_BOX = "//*[@data-test='advertiser-edit-campaign-additional-targeting-accordion-panel-required']";
//  private static final String CSS_EXCLUDE_BOX = "//*[@data-test='advertiser-edit-campaign-additional-targeting-accordion-panel-excluded']";

  @FindBy(xpath = "//*[@data-test='advertiser-edit-campaign-additional-targeting-accordion-panel-required']")  private WebElement requireBox;
  @FindBy(xpath = "//*[@data-test='advertiser-edit-campaign-additional-targeting-accordion-panel-excluded']")  private WebElement excludeBox;
  @FindBy(css = "[data-test='advertiser-edit-campaign-navigate-back']")  private WebElement backButton;
  @FindBy(css = "[data-test='advertiser-edit-campaign-save-as-draft']")  private WebElement saveAsDraftButton;
  @FindBy(css = "[data-test='advertiser-edit-campaign-save-and-continue']")  private WebElement saveButton;
  @FindBy(id = "mat-expansion-panel-header-16") private WebElement hideBox;

  private WebDriver driver;
  private WebDriverWait wait;

  public EditCampaignTargetingPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 10);
    PageFactory.initElements(driver, this);
  }

//  public void toggleRequireBox() {
//    wait.until(ExpectedConditions.visibilityOf(requireBox));
//    boolean isDisplayed = requireAvailOptionList.isDisplayed();
//    requireBox.findElement(By.cssSelector("mat-expansion-panel-header")).click();
//    if (isDisplayed) {
//      wait.until(ExpectedConditions.not(ExpectedConditions.visibilityOf(requireAvailOptionList)));
//    } else {
//      wait.until(ExpectedConditions.visibilityOf(requireAvailOptionList));
//    }
//  }
//
//  public void toggleExcludeBox() {
//    wait.until(ExpectedConditions.visibilityOf(excludeBox));
//    boolean isDisplayed = excludeAvailOptionList.isDisplayed();
//    excludeBox.findElement(By.cssSelector("mat-expansion-panel-header")).click();
//    if (isDisplayed) {
//      wait.until(ExpectedConditions.not(ExpectedConditions.visibilityOf(excludeAvailOptionList)));
//    } else {
//      wait.until(ExpectedConditions.visibilityOf(excludeAvailOptionList));
//    }
//  }

  public void showRequireBox() {
    showBox(requireBox);
  }

  public void showExcludeBox() {
    showBox(excludeBox);
  }

  private void showBox(WebElement box) {
    wait.until(ExpectedConditions.visibilityOf(box));
    WebElement availOptionList = box.findElement(By.cssSelector("div.mat-expansion-panel-content"));
    boolean isDisplayed = availOptionList.isDisplayed();
    if (!isDisplayed) {
      box.findElement(By.cssSelector("mat-expansion-panel-header")).click();
      wait.until(ExpectedConditions.visibilityOf(availOptionList));
    }
  }
  private void lista() {
    Maps.createLista();
    int r = (int) (Math.random()*3);
    String name1 = new String [] {"Site","User","Device"}[r];
//    Site
    if (r == 0){
      int r1 = (int) (Math.random()*4);
      String name2 = new String [] {"Site domain", "Inside frame", "Language", "Content keywords"}[r1];
      if (r1 == 0){
        int r11 = (int) (Math.random()*2);
        String name3 = new String [] {"coinmarketcap.com", "icoalert.com"}[r11];
        Maps.lista3("lista3", name3);
      }
      if (r1 == 1){
        int r11 = (int) (Math.random()*2);
        String name3 = new String [] {"Yes", "No"}[r11];
        Maps.lista3("lista3", name3);
      }
      if (r1 == 2){
        int r11 = (int) (Math.random()*4);
        String name3 = new String [] {"Polish", "English", "Italian", "Japanese"}[r11];
        Maps.lista3("lista3", name3);
      }
      if (r1 == 3){
        int r11 = (int) (Math.random()*2);
        String name3 = new String [] {"blockchain", "ico"}[r11];
        Maps.lista3("lista3", name3);
      }
      Maps.lista2("lista2", name2);
    }
//    User
    if (r == 1){
      int r1 = (int) (Math.random()*6);
      String name2 = new String [] {"Age", "Height", "Interest keywords", "Language", "Gender", "Geo"}[r1];
      if (r1 == 0){
        int r11 = (int) (Math.random()*2);
        String name3 = new String [] {"18-35", "36-65"}[r11];
        Maps.lista3("lista3", name3);
      }
      if (r1 == 1){
        int r11 = (int) (Math.random()*2);
        String name3 = new String [] {"900 or more", "between 200 and 300"}[r11];
        Maps.lista3("lista3", name3);
      }
      if (r1 == 2){
        int r11 = (int) (Math.random()*2);
        String name3 = new String [] {"blockchain", "ico"}[r11];
        Maps.lista3("lista3", name3);
      }
      if (r1 == 3){
        int r11 = (int) (Math.random()*4);
        String name3 = new String [] {"Polish", "English", "Italian", "Japanese"}[r11];
        Maps.lista3("lista3", name3);
      }
      if (r1 == 4){
        int r11 = (int) (Math.random()*2);
        String name3 = new String [] {"Male", "Female"}[r11];
        Maps.lista3("lista3", name3);
      }
      if (r1 == 5){
        int r11 = (int) (Math.random()*2);
        String name3 = new String [] {"Continent", "Country"}[r11];
        Maps.lista3("lista3", name3);
      }
      Maps.lista2("lista2", name2);
    }
//    Device
    if (r == 2){
      int r1 = (int) (Math.random()*6);
      String name2 = new String [] {"Screen size", "Language", "Browser", "Operating system", "Geo", "Javascript support"}[r1];
      if (r1 == 0){
        int r11 = (int) (Math.random()*2);
        String name3 = new String [] {"Width", "Height"}[r11];
        Maps.lista3("lista3", name3);
      }
      if (r1 == 1){
        int r11 = (int) (Math.random()*4);
        String name3 = new String [] {"Polish", "English", "Italian", "Japanese"}[r11];
        Maps.lista3("lista3", name3);
      }
      if (r1 == 2){
        int r11 = (int) (Math.random()*3);
        String name3 = new String [] {"Chrome", "Edge", "Firefox"}[r11];
        Maps.lista3("lista3", name3);
      }
      if (r1 == 3){
        int r11 = (int) (Math.random()*3);
        String name3 = new String [] {"Linux", "Mac", "Windows"}[r11];
        Maps.lista3("lista3", name3);
      }
      if (r1 == 4){
        int r11 = (int) (Math.random()*2);
        String name3 = new String [] {"Continent", "Country"}[r11];
        Maps.lista3("lista3", name3);
      }
      if (r1 == 5){
        int r11 = (int) (Math.random()*2);
        String name3 = new String [] {"Yes", "No"}[r11];
        Maps.lista3("lista3", name3);
      }
      Maps.lista2("lista2", name2);
    }
    Maps.lista1("lista1", name1);
  }

  public void selectOption(TargetCategory category) {
    lista();
//    System.out.println("lista1: "+Maps.getLista1("lista1"));
//    System.out.println("lista2: "+Maps.getLista2("lista2"));
//    System.out.println("lista3: "+Maps.getLista3("lista3"));
    String[] s1 = new String[]{Maps.getLista1("lista1"), Maps.getLista2("lista2"), Maps.getLista3("lista3")};
    WebElement box = null;
    switch (category) {
      case REQUIRED:
        box = requireBox;
        Maps.requires1("requires1",Maps.getLista1("lista1"));
        Maps.requires2("requires2",Maps.getLista2("lista2"));
        Maps.requires3("requires3",Maps.getLista3("lista3"));
        break;
      case EXCLUDED:
        box = excludeBox;
        Maps.excludes1("excludes1",Maps.getLista1("lista1"));
        Maps.excludes2("excludes2",Maps.getLista2("lista2"));
        Maps.excludes3("excludes3",Maps.getLista3("lista3"));
        break;
    }
    showBox(box);
    wait.until(ExpectedConditions.visibilityOf(box));
    String xpath;
    WebElement opt;
    for (String s : s1) {
//      xpath = String.format(".//div[@data-test='common-targeting-select-option' and normalize-space(.)='%s']", s);
      xpath = String.format(".//*[contains(text(), '%s')]", s);
      opt = box.findElement(By.xpath(xpath));
      wait.until(ExpectedConditions.visibilityOf(opt));
//      System.out.println("xpath: "+xpath);
      opt.click();
    }
//    xpath = "//*[@data-test='common-targeting-select-add-selected-options-button']";
    xpath = ".//*[contains(text(), 'Add Selected')]";
//    System.out.println("xpath: "+xpath);
    opt = box.findElement(By.xpath(xpath));
    wait.until(ExpectedConditions.visibilityOf(opt));
    opt.click();
  }


  public void advertiserTargetingAll(TargetCategory category,String target_1,String target_2,String target_3) {
    String[] s1 = new String[]{target_1, target_2, target_3};
    WebElement box = null;
    switch (category) {
      case REQUIRED:
        box = requireBox;
        break;
      case EXCLUDED:
        box = excludeBox;
        break;
    }
    showBox(box);
    wait.until(ExpectedConditions.visibilityOf(box));
    String xpath;
    WebElement opt;
    for (String s : s1) {
      xpath = String.format(".//*[contains(text(), '%s')]", s);
      opt = box.findElement(By.xpath(xpath));
      wait.until(ExpectedConditions.visibilityOf(opt));
//      System.out.println("xpath: "+xpath);
      opt.click();
    }
    xpath = ".//*[contains(text(), 'Add Selected')]";
//    System.out.println("xpath: "+xpath);
    opt = box.findElement(By.xpath(xpath));
    wait.until(ExpectedConditions.visibilityOf(opt));
    opt.click();
  }

  public void sleep(String czas) {
    try {
      Thread.sleep(Long.parseLong(czas));
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  }











  public void getSelectedOption() {
//    showRequireBox();
//    int size = requireSelectedOptionList.size();
//    for (WebElement we : requireSelectedOptionList) {
//      String text = we.findElement(By.tagName("p")).getText();
//    }
  }

  public void saveData() {
    wait.until(ExpectedConditions.visibilityOf(saveButton));
    saveButton.click();
  }

  public void saveDataAsDraft() {
    wait.until(ExpectedConditions.visibilityOf(saveAsDraftButton));
    saveAsDraftButton.click();
  }

  public void goBack() {
    wait.until(ExpectedConditions.visibilityOf(backButton));
    backButton.click();
    driver.switchTo().alert().accept();
  }

  public enum TargetCategory {
    REQUIRED,
    EXCLUDED
  }


}
