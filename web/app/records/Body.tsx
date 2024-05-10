"use client";

import React from "react";
import { File, ListFilter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecordsTable } from "./Table";
import { Details } from "./Details";
import { useRecordsPageContext } from "./Context";
import { Chart } from "./Chart";

export default function Body() {
  const { setSelected, setBy } = useRecordsPageContext();

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="mx-auto grid w-full max-w-[59rem] flex-1 auto-rows-max gap-4">
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Tabs
              defaultValue="hour"
              onValueChange={(value: any) => {
                setBy(value);
                setSelected(null);
              }}
            >
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="live">Live</TabsTrigger>
                  <TabsTrigger value="hour">Hourly</TabsTrigger>
                  <TabsTrigger value="day">Daily</TabsTrigger>
                  <TabsTrigger value="month">Monthly</TabsTrigger>
                  {/* <TabsTrigger value="yearly">Yearly</TabsTrigger> */}
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-sm"
                      >
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem checked>
                        Fulfilled
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Declined
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Refunded
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-sm"
                  >
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Export</span>
                  </Button>
                </div>
              </div>
              <TabsContent value="live">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
                    <CardTitle>Chart of the Live Records</CardTitle>
                    <CardDescription>
                      Chart of recent data from your device.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Chart />
                  </CardContent>
                </Card>
                <Card x-chunk="dashboard-05-chunk-3" className="mt-4">
                  <CardHeader className="px-7">
                    <CardTitle>Live Records</CardTitle>
                    <CardDescription>
                      Recent data from your device.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecordsTable />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="hour">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
                    <CardTitle>Chart of the Hourly Records</CardTitle>
                    <CardDescription>
                      Chart of recent data from your device.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Chart />
                  </CardContent>
                </Card>
                <Card x-chunk="dashboard-05-chunk-3" className="mt-4">
                  <CardHeader className="px-7">
                    <CardTitle>Hourly Records</CardTitle>
                    <CardDescription>
                      Recent data from your device.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecordsTable />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="day">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
                    <CardTitle>Chart of the Daily Records</CardTitle>
                    <CardDescription>
                      Chart of recent data from your device.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Chart />
                  </CardContent>
                </Card>
                <Card x-chunk="dashboard-05-chunk-3" className="mt-4">
                  <CardHeader className="px-7">
                    <CardTitle>Daily Records</CardTitle>
                    <CardDescription>
                      Recent data from your device.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecordsTable />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="month">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
                    <CardTitle>Chart of the Monthly Records</CardTitle>
                    <CardDescription>
                      Chart of recent data from your device.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Chart />
                  </CardContent>
                </Card>
                <Card x-chunk="dashboard-05-chunk-3" className="mt-4">
                  <CardHeader className="px-7">
                    <CardTitle>Montly Records</CardTitle>
                    <CardDescription>
                      Recent data from your device.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecordsTable />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div
            id="detail_section"
            className="grid auto-rows-max items-start gap-4 lg:gap-8"
          >
            <Details />
          </div>
        </div>
      </div>
    </main>
  );
}
